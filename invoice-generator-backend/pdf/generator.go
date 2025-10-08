package pdf

import (
	"bytes"
	"fmt"
	"html/template"
	"log"
	"os"
	"os/exec"
	"path/filepath"

	"invoice-generator-go/models"
	"invoice-generator-go/storage"

	"github.com/google/uuid"
)

// DataForTemplate is a struct to hold data for template rendering.
// Update this struct to include any data that your templates might need.
type DataForTemplate struct {
	Invoice      models.Invoice
	InvoiceItems []models.InvoiceItem
	Company      models.User
	// Add other fields as needed for your template
}

// GeneratePDF generates a PDF from an Invoice object.
func GeneratePDF(invoice models.Invoice) (string, error) {
	// Load the template content from the database
	templateContent, err := LoadTemplateContent(invoice.TemplateID.String())
	if err != nil {
		return "", fmt.Errorf("failed to load template content: %v", err)
	}

	// Parse the HTML template
	tmpl, err := template.New("invoice").Parse(templateContent)
	if err != nil {
		return "", fmt.Errorf("failed to parse template: %v", err)
	}

	// Fetch related data for invoice
	invoiceItems, err := storage.GetInvoiceItemsByInvoiceID(invoice.ID)
	if err != nil {
		return "", fmt.Errorf("failed to get invoice items: %v", err)
	}

	// Fetch user details using GetUserByID
	user, err := storage.GetUserByID(invoice.UserID)
	if err != nil {
		return "", fmt.Errorf("failed to get user details: %v", err)
	}
	// Prepare data for the template
	data := DataForTemplate{
		Invoice:      invoice,
		InvoiceItems: invoiceItems,
		Company:      *user, // Pass the user object
	}

	// Execute the template
	var htmlBuffer bytes.Buffer
	err = tmpl.Execute(&htmlBuffer, data)
	if err != nil {
		return "", fmt.Errorf("failed to execute template: %v", err)
	}

	// Write the HTML content to a temporary file
	tmpHTMLFile := fmt.Sprintf("temp_invoice_%s.html", invoice.ID)
	err = os.WriteFile(tmpHTMLFile, htmlBuffer.Bytes(), 0644)
	if err != nil {
		return "", fmt.Errorf("failed to write temporary HTML file: %v", err)
	}
	defer func(name string) {
		err := os.Remove(name)
		if err != nil {

		}
	}(tmpHTMLFile) // Clean up the temporary file

	// Define the path for the output PDF file
	pdfFilePath := fmt.Sprintf("invoice_%s.pdf", invoice.ID)

	// Convert HTML to PDF using wkhtmltopdf
	err = convertHTMLToPDF(tmpHTMLFile, pdfFilePath)
	if err != nil {
		return "", fmt.Errorf("failed to convert HTML to PDF: %v", err)
	}

	return pdfFilePath, nil
}

// convertHTMLToPDF uses wkhtmltopdf to convert an HTML file to a PDF file.
func convertHTMLToPDF(htmlFilePath, pdfFilePath string) error {
	// Construct the command
	cmd := exec.Command("wkhtmltopdf", htmlFilePath, pdfFilePath)

	// Set the working directory if necessary
	cmd.Dir, _ = filepath.Abs(filepath.Dir(htmlFilePath))

	// Capture the output
	var out bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &stderr

	// Run the command
	err := cmd.Run()
	if err != nil {
		log.Printf("wkhtmltopdf output: %s\n", out.String())
		log.Printf("wkhtmltopdf error: %s\n", stderr.String())
		return fmt.Errorf("error running wkhtmltopdf: %v", err)
	}

	return nil
}

// LoadTemplateContent fetches the template content from the database by its ID.
func LoadTemplateContent(templateID string) (string, error) {
	templateUUID, err := uuid.Parse(templateID)
	if err != nil {
		return "", fmt.Errorf("invalid template ID: %v", err)
	}

	dbTemplate, err := storage.GetTemplateByID(templateUUID)
	if err != nil {
		return "", fmt.Errorf("failed to get template by ID: %v", err)
	}
	return dbTemplate.Content, nil
}
