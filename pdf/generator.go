package pdf

import (
	"bytes"
	"fmt"
	"html/template"
	"invoice-generator-go/models"
	"invoice-generator-go/storage"
	"log"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/jung-kurt/gofpdf"
)

// LoadTemplateContent fetches the template content from the database by its ID.
func LoadTemplateContent(templateID int) (string, error) {
	template, err := storage.GetTemplateByID(templateID)
	if err != nil {
		return "", fmt.Errorf("failed to get template by ID: %v", err)
	}
	return template.Content, nil
}

// DataForTemplate is a struct to hold data for template rendering
type DataForTemplate struct {
	Invoice models.Invoice
	// Add other fields if needed for your template
}

// GeneratePDF generates a PDF from an Invoice object.
func GeneratePDF(invoice models.Invoice) (string, error) {
	// Initialize gofpdf
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddPage()
	pdf.SetFont("Arial", "B", 16)

	// Load and parse the HTML template content
	templateContent, err := LoadTemplateContent(invoice.TemplateID)
	if err != nil {
		return "", fmt.Errorf("failed to load template content: %v", err)
	}

	tmpl, err := template.New("invoice").Parse(templateContent)
	if err != nil {
		return "", fmt.Errorf("failed to parse template: %v", err)
	}

	// Prepare data for the template
	data := DataForTemplate{
		Invoice: invoice,
		// Initialize other fields as necessary
	}

	// Execute the template
	var htmlBuffer bytes.Buffer
	err = tmpl.Execute(&htmlBuffer, data)
	if err != nil {
		return "", fmt.Errorf("failed to execute template: %v", err)
	}

	// Write the HTML content to a temporary file
	tmpHTMLFile := fmt.Sprintf("temp_invoice_%d.html", invoice.ID)
	err = os.WriteFile(tmpHTMLFile, htmlBuffer.Bytes(), 0644)
	if err != nil {
		return "", fmt.Errorf("failed to write temporary HTML file: %v", err)
	}
	defer os.Remove(tmpHTMLFile) // Clean up the temporary file

	// Define the path for the output PDF file
	pdfFilePath := fmt.Sprintf("invoice_%d.pdf", invoice.ID)

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
