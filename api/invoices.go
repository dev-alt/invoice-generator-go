package api

import (
	"invoice-generator-go/models"
	"invoice-generator-go/pdf"
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

	invoice.UserID = userUUID
	invoice.ID = uuid.New()
	invoice.InvoiceDate = time.Now()
	invoice.DueDate = invoice.InvoiceDate.AddDate(0, 1, 0)

	// Save the invoice to the database
	invoiceID, err := storage.CreateInvoice(&invoice)
	if err != nil {
		log.Printf("Error creating invoice: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create invoice"})
		return
	}

	// Fetch the newly created invoice to get all fields
	newInvoice, err := storage.GetInvoiceByID(invoice.ID)
	if err != nil {
		log.Printf("Error fetching invoice: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve created invoice"})
		return
	}

	// Generate PDF
	pdfFilePath, err := pdf.GeneratePDF(*newInvoice)
	if err != nil {
		log.Printf("Error generating PDF: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate PDF for invoice"})
		return
	}

	// Update invoice with PDF path
	newInvoice.PdfPath = pdfFilePath
	if err := storage.UpdateInvoice(newInvoice); err != nil {
		log.Printf("Error updating invoice with PDF path: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update invoice with PDF path"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":    "Invoice created successfully",
		"invoice_id": invoiceID,
		"pdf_path":   pdfFilePath, // Now includes the path to the PDF
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
