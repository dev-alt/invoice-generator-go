package api

import (
	"invoice-generator-go/models"
	"invoice-generator-go/storage"
	"invoice-generator-go/utils"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func createInvoice(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var invoice models.Invoice
	if err := c.ShouldBindJSON(&invoice); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	// Validate and sanitize invoice fields
	if invoice.InvoiceNumber == "" {
		// Auto-generate invoice number if not provided
		invoice.InvoiceNumber = utils.GenerateInvoiceNumber()
	} else {
		// Validate provided invoice number
		if err := utils.ValidateInvoiceNumber(invoice.InvoiceNumber); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	// Validate customer information
	if err := utils.ValidateRequiredString(invoice.CustomerName, "customer name"); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	invoice.CustomerName = utils.SanitizeString(invoice.CustomerName, 255)

	if invoice.CustomerEmail != "" {
		if err := utils.ValidateEmail(invoice.CustomerEmail); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid customer email: " + err.Error()})
			return
		}
		invoice.CustomerEmail = strings.ToLower(strings.TrimSpace(invoice.CustomerEmail))
	}

	if invoice.CustomerAddress != "" {
		invoice.CustomerAddress = utils.SanitizeString(invoice.CustomerAddress, 500)
	}

	// Validate amounts
	if err := utils.ValidateAmount(invoice.Subtotal, "subtotal"); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := utils.ValidateTaxRate(invoice.TaxRate); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := utils.ValidateAmount(invoice.TaxAmount, "tax amount"); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := utils.ValidateAmount(invoice.TotalAmount, "total amount"); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate currency
	if invoice.Currency != "" {
		invoice.Currency = strings.ToUpper(invoice.Currency)
		// Don't validate currency - allow any 3-letter code for flexibility
	} else {
		invoice.Currency = "$" // Default currency symbol
	}

	// Sanitize notes
	if invoice.Notes != "" {
		invoice.Notes = utils.SanitizeString(invoice.Notes, 1000)
	}

	// Validate invoice items
	for i, item := range invoice.Items {
		if err := utils.ValidateRequiredString(item.Description, "item description"); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error() + " (item " + string(rune(i+1)) + ")"})
			return
		}
		if item.Quantity <= 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "item quantity must be positive"})
			return
		}
		if err := utils.ValidateAmount(item.UnitPrice, "item unit price"); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	userUUID, err := uuid.Parse(userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID format"})
		return
	}

	// Set up the invoice
	invoice.UserID = userUUID
	invoice.ID = uuid.New()
	invoice.Status = "draft" // Set default status

	// Use current time for dates if not provided
	if invoice.InvoiceDate.IsZero() {
		invoice.InvoiceDate = time.Now()
	}
	if invoice.DueDate.IsZero() {
		invoice.DueDate = invoice.InvoiceDate.AddDate(0, 1, 0) // Default due date: 1 month
	}

	// Create invoice items if present
	var items []models.InvoiceItem
	if len(invoice.Items) > 0 {
		items = invoice.Items
		invoice.Items = nil // Clear items before saving invoice
	}

	// Save the invoice to the database
	invoiceID, err := storage.CreateInvoice(&invoice)
	if err != nil {
		log.Printf("Error creating invoice: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create invoice"})
		return
	}

	// If there are items, save them
	if len(items) > 0 {
		invoiceUUID, _ := uuid.Parse(invoiceID)
		for _, item := range items {
			item.InvoiceID = invoiceUUID
			item.ID = uuid.New()
			if err := storage.CreateInvoiceItem(&item); err != nil {
				log.Printf("Error creating invoice item: %v", err)
				// Consider whether to rollback the invoice creation here
			}
		}
	}

	// Return the created invoice ID
	c.JSON(http.StatusCreated, gin.H{
		"message":    "Invoice created successfully",
		"invoice_id": invoiceID,
	})
}

// getInvoice retrieves a specific invoice by ID.
func getInvoice(c *gin.Context) {
	// Get the user ID from the context (set by the AuthMiddleware)
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Extract the invoice ID from the URL parameter
	invoiceIDStr := c.Param("id")
	invoiceID, err := uuid.Parse(invoiceIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid invoice ID"})
		return
	}

	// Fetch the invoice from the database
	invoice, err := storage.GetInvoiceByID(invoiceID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Invoice not found"})
		return
	}

	// Convert the user ID from the context to uuid.UUID
	userUUID, err := uuid.Parse(userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID format"})
		return
	}

	// Check if the invoice belongs to the requesting user
	if invoice.UserID != userUUID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to view this invoice"})
		return
	}

	// Fetch invoice items
	items, err := storage.GetInvoiceItemsByInvoiceID(invoiceID)
	if err != nil {
		log.Printf("Error fetching invoice items: %v", err)
		// Continue anyway, just return empty items
		items = []models.InvoiceItem{}
	}
	invoice.Items = items

	// Respond with the invoice details
	c.JSON(http.StatusOK, invoice)
}

// listInvoices retrieves all invoices for the authenticated user.
func listInvoices(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	userUUID, err := uuid.Parse(userID.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID format", "details": err.Error()})
		return
	}

	invoices, err := storage.GetInvoicesByUserID(userUUID)
	if err != nil {
		log.Printf("Error fetching invoices: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve invoices", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"invoices": invoices})
}

// deleteInvoice deletes an invoice by ID.
func deleteInvoice(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	invoiceIDStr := c.Param("id")
	invoiceID, err := uuid.Parse(invoiceIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid invoice ID"})
		return
	}

	// Fetch the invoice to verify ownership
	invoice, err := storage.GetInvoiceByID(invoiceID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Invoice not found"})
		return
	}

	userUUID, err := uuid.Parse(userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID format"})
		return
	}

	if invoice.UserID != userUUID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to delete this invoice"})
		return
	}

	// Delete the invoice
	err = storage.DeleteInvoice(invoiceID)
	if err != nil {
		log.Printf("Error deleting invoice: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete invoice"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Invoice deleted successfully"})
}

// updateInvoice updates an existing invoice.
func updateInvoice(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	invoiceIDStr := c.Param("id")
	invoiceID, err := uuid.Parse(invoiceIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid invoice ID"})
		return
	}

	// Fetch the existing invoice to verify ownership
	existingInvoice, err := storage.GetInvoiceByID(invoiceID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Invoice not found"})
		return
	}

	userUUID, err := uuid.Parse(userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID format"})
		return
	}

	if existingInvoice.UserID != userUUID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to update this invoice"})
		return
	}

	var invoice models.Invoice
	if err := c.ShouldBindJSON(&invoice); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Preserve certain fields
	invoice.ID = invoiceID
	invoice.UserID = userUUID
	invoice.UpdatedAt = time.Now()

	// Handle items if present
	var items []models.InvoiceItem
	if len(invoice.Items) > 0 {
		items = invoice.Items
		invoice.Items = nil
	}

	// Update the invoice
	err = storage.UpdateInvoice(&invoice)
	if err != nil {
		log.Printf("Error updating invoice: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update invoice"})
		return
	}

	// Update items if provided (delete old items and create new ones)
	if len(items) > 0 {
		// Delete old items
		err = storage.DeleteInvoiceItems(invoiceID)
		if err != nil {
			log.Printf("Error deleting old invoice items: %v", err)
		}

		// Create new items
		for _, item := range items {
			item.InvoiceID = invoiceID
			item.ID = uuid.New()
			if err := storage.CreateInvoiceItem(&item); err != nil {
				log.Printf("Error creating invoice item: %v", err)
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Invoice updated successfully"})
}
