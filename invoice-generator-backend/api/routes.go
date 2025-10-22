package api

import (
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		// Public routes with strict rate limiting
		api.POST("/register", StrictRateLimitMiddleware(), registerUser)
		api.POST("/login", StrictRateLimitMiddleware(), loginUser)

		// Protected routes (require authentication)
		protected := api.Group("/")
		protected.Use(AuthMiddleware())
		{
			// Invoice routes
			protected.POST("/invoices", createInvoice)
			protected.GET("/invoices", listInvoices)
			protected.GET("/invoices/:id", getInvoice)
			protected.PUT("/invoices/:id", updateInvoice)
			protected.DELETE("/invoices/:id", deleteInvoice)

			// PDF routes
			protected.POST("/invoices/:id/generate-pdf", generatePDF)
			protected.GET("/invoices/:id/download-pdf", downloadPDF)
			protected.GET("/invoices/:id/preview-pdf", previewPDF)

			// Template routes
			protected.POST("/templates", uploadTemplate)
			protected.GET("/templates", listTemplates)
		}
	}
}
