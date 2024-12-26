package storage

import (
	"invoice-generator-go/models"
)

// CreateInvoice inserts a new invoice into the database
func CreateInvoice(invoice models.Invoice) (uint, error) {
	var id uint
	err := DB.QueryRow(`
        INSERT INTO invoices (user_id, invoice_number, created_at, status)
        VALUES ($1, $2, $3, $4)
        RETURNING id
    `, invoice.UserID, invoice.InvoiceNumber, invoice.CreatedAt, invoice.Status).Scan(&id)

	if err != nil {
		return 0, err
	}

	return id, nil
}
