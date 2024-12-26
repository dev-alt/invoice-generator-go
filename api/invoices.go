package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"invoice-generator-go/models"
)

// Placeholder - we'll implement the actual logic later
func createInvoice(c *gin.Context) {
	var invoice models.Invoice
	if err := c.ShouldBindJSON(&invoice); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// TODO: Save invoice to the database (storage.CreateInvoice(...))
	// TODO: Generate PDF and handle errors

	c.JSON(http.StatusCreated, gin.H{"message": "Invoice created", "invoice": invoice})
}

func getInvoice(c *gin.Context) {
	invoiceID := c.Param("id")

	// TODO: Fetch invoice from the database (storage.GetInvoiceByID(...))
	// TODO: Check if invoice exists and handle errors

	c.JSON(http.StatusOK, gin.H{"message": "Invoice details for ID " + invoiceID})
}
