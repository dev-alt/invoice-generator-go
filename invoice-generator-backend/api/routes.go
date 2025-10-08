package api

import (
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		// ... (public routes)
		api.POST("/register", registerUser)
		api.POST("/login", loginUser)

		// Protected routes (require authentication)
		protected := api.Group("/")
		protected.Use(AuthMiddleware())
		{
			protected.POST("/invoices", createInvoice)
			protected.GET("/invoices/:id", getInvoice)
			protected.POST("/templates", uploadTemplate)
			protected.GET("/templates", listTemplates)
		}
	}
}
