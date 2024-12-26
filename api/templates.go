package api

import (
	"invoice-generator-go/models"
	"invoice-generator-go/storage"
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"
)

func uploadTemplate(c *gin.Context) {
	// Get user ID from context (set by AuthMiddleware)
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Get the uploaded file
	file, err := c.FormFile("template")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Template file is required"})
		return
	}

	// Validate file type (optional) - e.g., check for .html or .tex extension

	// Read file content
	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read file"})
		return
	}
	defer src.Close()

	fileBytes, err := ioutil.ReadAll(src)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read file"})
		return
	}

	// Save template to database
	template := models.Template{
		UserID:  userID.(uint), // Type assertion to uint
		Name:    file.Filename,
		Content: string(fileBytes),
	}
	templateID, err := storage.CreateTemplate(template) // Implement this
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save template"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Template uploaded", "template_id": templateID})
}
func listTemplates(c *gin.Context) {
	// Get user ID from context (set by AuthMiddleware)
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Get templates for the user
	templates, err := storage.GetTemplatesByUserID(userID.(uint)) // Implement this
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve templates"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"templates": templates})
}
