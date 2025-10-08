package api

import (
	"invoice-generator-go/models"
	"invoice-generator-go/storage"
	"log"
	"net/http"
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
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
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

	// Respond with the invoice details
	c.JSON(http.StatusOK, invoice)
}
