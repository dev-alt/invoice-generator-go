package storage

import (
	"fmt"
	"invoice-generator-go/models"

	"github.com/google/uuid"
)

// CreateInvoice inserts a new invoice into the database.
func CreateInvoice(invoice *models.Invoice) (string, error) {
	invoice.ID = uuid.New()
	query := `
        INSERT INTO invoices (id, user_id, template_id, invoice_number, status, customer_name, customer_email, customer_address, invoice_date, due_date, currency, subtotal, tax_rate, tax_amount, total_amount, notes, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING id
    `

	var id uuid.UUID
	err := DB.QueryRow(query, invoice.ID, invoice.UserID, invoice.TemplateID, invoice.InvoiceNumber, invoice.Status, invoice.CustomerName, invoice.CustomerEmail, invoice.CustomerAddress, invoice.InvoiceDate, invoice.DueDate, invoice.Currency, invoice.Subtotal, invoice.TaxRate, invoice.TaxAmount, invoice.TotalAmount, invoice.Notes, invoice.CreatedAt, invoice.UpdatedAt).Scan(&id)
	if err != nil {
		return "", fmt.Errorf("failed to insert invoice: %v", err)
	}

	return id.String(), nil
}

// CreateInvoiceItem inserts a new invoice item into the database.
func CreateInvoiceItem(item *models.InvoiceItem) error {
	query := `
        INSERT INTO invoice_items (id, invoice_id, description, quantity, unit_price, total_price, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `

	_, err := DB.Exec(query,
		item.ID,
		item.InvoiceID,
		item.Description,
		item.Quantity,
		item.UnitPrice,
		item.TotalPrice,
	)
	if err != nil {
		return fmt.Errorf("failed to insert invoice item: %v", err)
	}

	return nil
}

// GetInvoiceByID retrieves an invoice by its ID from the database.
func GetInvoiceByID(invoiceID uuid.UUID) (*models.Invoice, error) {
	var invoice models.Invoice
	query := `
        SELECT id, user_id, template_id, invoice_number, status, customer_name, customer_email, customer_address, invoice_date, due_date, currency, subtotal, tax_rate, tax_amount, total_amount, notes, created_at, updated_at
        FROM invoices
        WHERE id = $1
    `
	err := DB.QueryRow(query, invoiceID).Scan(&invoice.ID, &invoice.UserID, &invoice.TemplateID, &invoice.InvoiceNumber, &invoice.Status, &invoice.CustomerName, &invoice.CustomerEmail, &invoice.CustomerAddress, &invoice.InvoiceDate, &invoice.DueDate, &invoice.Currency, &invoice.Subtotal, &invoice.TaxRate, &invoice.TaxAmount, &invoice.TotalAmount, &invoice.Notes, &invoice.CreatedAt, &invoice.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to get invoice by ID: %v", err)
	}

	return &invoice, nil
}

// GetInvoiceItemsByInvoiceID retrieves all items for a given invoice ID.
func GetInvoiceItemsByInvoiceID(invoiceID uuid.UUID) ([]models.InvoiceItem, error) {
	rows, err := DB.Query(`
        SELECT id, invoice_id, description, quantity, unit_price, total_price, created_at, updated_at
        FROM invoice_items
        WHERE invoice_id = $1
    `, invoiceID)
	if err != nil {
		return nil, fmt.Errorf("failed to get invoice items by invoice ID: %v", err)
	}
	defer rows.Close()

	var items []models.InvoiceItem
	for rows.Next() {
		var item models.InvoiceItem
		if err := rows.Scan(&item.ID, &item.InvoiceID, &item.Description, &item.Quantity, &item.UnitPrice, &item.TotalPrice, &item.CreatedAt, &item.UpdatedAt); err != nil {
			return nil, fmt.Errorf("failed to scan invoice item: %v", err)
		}
		items = append(items, item)
	}

	return items, nil
}

// UpdateInvoice updates an existing invoice in the database.
func UpdateInvoice(invoice *models.Invoice) error {
	query := `
        UPDATE invoices
        SET
            user_id = $2,
            template_id = $3,
            invoice_number = $4,
            status = $5,
            customer_name = $6,
            customer_email = $7,
            customer_address = $8,
            invoice_date = $9,
            due_date = $10,
            currency = $11,
            subtotal = $12,
            tax_rate = $13,
            tax_amount = $14,
            total_amount = $15,
            notes = $16,
            updated_at = $17,
            pdf_path = $18
        WHERE id = $1
    `
	result, err := DB.Exec(query, invoice.ID, invoice.UserID, invoice.TemplateID, invoice.InvoiceNumber, invoice.Status, invoice.CustomerName, invoice.CustomerEmail, invoice.CustomerAddress, invoice.InvoiceDate, invoice.DueDate, invoice.Currency, invoice.Subtotal, invoice.TaxRate, invoice.TaxAmount, invoice.TotalAmount, invoice.Notes, invoice.UpdatedAt, invoice.PdfPath)
	if err != nil {
		return fmt.Errorf("failed to update invoice: %v", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %v", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("no invoice found with ID: %s", invoice.ID)
	}

	return nil
}
