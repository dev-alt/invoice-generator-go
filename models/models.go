package models

import (
	"time"

	"github.com/google/uuid"
)

// User represents a user in the system.
type User struct {
	ID           uuid.UUID `json:"id" gorm:"type:uuid;default:uuid_generate_v4()"`
	Email        string    `json:"email" gorm:"unique;not null"`
	PasswordHash string    `json:"-"`
	CompanyName  string    `json:"company_name"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// Template represents an invoice template in the system.
type Template struct {
	ID            uuid.UUID `json:"id" gorm:"type:uuid;default:uuid_generate_v4()"`
	UserID        uuid.UUID `json:"user_id" gorm:"type:uuid"`
	Name          string    `json:"name"`
	Language      string    `json:"language"`
	BackgroundURL string    `json:"background_url"`
	LogoURL       string    `json:"logo_url"`
	Content       string    `json:"content"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// Invoice represents an invoice in the system.
type Invoice struct {
	ID              uuid.UUID `json:"id" gorm:"type:uuid;default:uuid_generate_v4()"`
	UserID          uuid.UUID `json:"user_id" gorm:"type:uuid"`
	TemplateID      uuid.UUID `json:"template_id" gorm:"type:uuid"`
	InvoiceNumber   string    `json:"invoice_number"`
	Status          string    `json:"status" gorm:"default:'draft'"`
	CustomerName    string    `json:"customer_name"`
	CustomerEmail   string    `json:"customer_email"`
	CustomerAddress string    `json:"customer_address"`
	InvoiceDate     time.Time `json:"invoice_date"`
	DueDate         time.Time `json:"due_date"`
	Currency        string    `json:"currency" gorm:"default:'USD'"`
	Subtotal        float64   `json:"subtotal"`
	TaxRate         float64   `json:"tax_rate"`
	TaxAmount       float64   `json:"tax_amount"`
	TotalAmount     float64   `json:"total_amount"`
	Notes           string    `json:"notes"`
	PdfPath         string    `json:"pdf_path"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// InvoiceItem represents an item in an invoice.
type InvoiceItem struct {
	ID          uuid.UUID `json:"id" gorm:"type:uuid;default:uuid_generate_v4()"`
	InvoiceID   uuid.UUID `json:"invoice_id" gorm:"type:uuid"`
	Description string    `json:"description"`
	Quantity    float64   `json:"quantity"`
	UnitPrice   float64   `json:"unit_price"`
	TotalPrice  float64   `json:"total_price"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
