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
	BackgroundURL *string   `json:"background_url,omitempty"`
	LogoURL       *string   `json:"logo_url,omitempty"`
	Content       string    `json:"content"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// Invoice represents an invoice in the system.
type Invoice struct {
	ID              uuid.UUID     `json:"id,omitempty" gorm:"type:uuid;primary_key;default:uuid_generate_v4()"`
	UserID          uuid.UUID     `json:"user_id,omitempty" gorm:"type:uuid;not null"`
	TemplateID      *uuid.UUID    `json:"template_id,omitempty" gorm:"type:uuid"` // Made optional
	InvoiceNumber   string        `json:"invoice_number" binding:"required" gorm:"not null"`
	Status          string        `json:"status" gorm:"type:varchar(20);default:'draft';check:status in ('draft','sent','paid','overdue','void')"`
	CustomerName    string        `json:"customer_name" binding:"required" gorm:"not null"`
	CustomerEmail   string        `json:"customer_email" binding:"omitempty,email"`
	CustomerAddress string        `json:"customer_address"`
	InvoiceDate     time.Time     `json:"invoice_date" binding:"required" gorm:"not null"`
	DueDate         time.Time     `json:"due_date" binding:"required" gorm:"not null"`
	Currency        string        `json:"currency" gorm:"type:varchar(3);default:'USD'"`
	Subtotal        float64       `json:"subtotal" binding:"required,min=0" gorm:"type:decimal(15,2);not null;check:subtotal >= 0"`
	TaxRate         float64       `json:"tax_rate" binding:"min=0,max=100" gorm:"type:decimal(5,2);check:tax_rate >= 0 AND tax_rate <= 100"`
	TaxAmount       float64       `json:"tax_amount" binding:"min=0" gorm:"type:decimal(15,2);check:tax_amount >= 0"`
	TotalAmount     float64       `json:"total_amount" binding:"required,min=0" gorm:"type:decimal(15,2);not null;check:total_amount >= 0"`
	Notes           string        `json:"notes,omitempty"`
	PdfPath         string        `json:"pdf_path,omitempty"`
	Items           []InvoiceItem `json:"items,omitempty" gorm:"-"` // Transient field for items
	CreatedAt       time.Time     `json:"created_at,omitempty" gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt       time.Time     `json:"updated_at,omitempty" gorm:"default:CURRENT_TIMESTAMP"`
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
