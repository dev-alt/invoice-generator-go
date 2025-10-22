package api

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"invoice-generator-go/pdf"
	"invoice-generator-go/storage"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// generatePDF generates a PDF for an invoice.
func generatePDF(c *gin.Context) {
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

	// Fetch the invoice
	invoice, err := storage.GetInvoiceByID(invoiceID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Invoice not found"})
		return
	}

	// Verify ownership
	userUUID, err := uuid.Parse(userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID format"})
		return
	}

	if invoice.UserID != userUUID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to generate PDF for this invoice"})
		return
	}

	// Check if template_id is set
	if invoice.TemplateID == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invoice does not have a template assigned"})
		return
	}

	// Generate the PDF
	pdfPath, err := pdf.GeneratePDF(*invoice)
	if err != nil {
		log.Printf("Error generating PDF: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate PDF", "details": err.Error()})
		return
	}

	// Update the invoice with the PDF path
	invoice.PdfPath = pdfPath
	invoice.UpdatedAt = time.Now()
	err = storage.UpdateInvoice(invoice)
	if err != nil {
		log.Printf("Error updating invoice with PDF path: %v", err)
		// Continue anyway, PDF was generated
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "PDF generated successfully",
		"pdf_path": pdfPath,
	})
}

// downloadPDF downloads the PDF for an invoice.
func downloadPDF(c *gin.Context) {
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

	// Fetch the invoice
	invoice, err := storage.GetInvoiceByID(invoiceID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Invoice not found"})
		return
	}

	// Verify ownership
	userUUID, err := uuid.Parse(userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID format"})
		return
	}

	if invoice.UserID != userUUID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to download this invoice"})
		return
	}

	// Check if PDF exists
	if invoice.PdfPath == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "PDF not generated yet"})
		return
	}

	// Check if file exists
	if _, err := os.Stat(invoice.PdfPath); os.IsNotExist(err) {
		c.JSON(http.StatusNotFound, gin.H{"error": "PDF file not found"})
		return
	}

	// Set headers for download
	fileName := fmt.Sprintf("invoice_%s.pdf", invoice.InvoiceNumber)
	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Transfer-Encoding", "binary")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", fileName))
	c.Header("Content-Type", "application/pdf")

	// Serve the file
	c.File(invoice.PdfPath)
}

// previewPDF serves the PDF for inline viewing in browser.
func previewPDF(c *gin.Context) {
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

	// Fetch the invoice
	invoice, err := storage.GetInvoiceByID(invoiceID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Invoice not found"})
		return
	}

	// Verify ownership
	userUUID, err := uuid.Parse(userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID format"})
		return
	}

	if invoice.UserID != userUUID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to preview this invoice"})
		return
	}

	// Check if PDF exists
	if invoice.PdfPath == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "PDF not generated yet"})
		return
	}

	// Check if file exists
	absPath, err := filepath.Abs(invoice.PdfPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid PDF path"})
		return
	}

	if _, err := os.Stat(absPath); os.IsNotExist(err) {
		c.JSON(http.StatusNotFound, gin.H{"error": "PDF file not found"})
		return
	}

	// Set headers for inline display
	c.Header("Content-Type", "application/pdf")
	c.Header("Content-Disposition", "inline")

	// Serve the file
	c.File(absPath)
}
