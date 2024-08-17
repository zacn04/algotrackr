package main

import (
	"leettrack/calculations"
	"leettrack/models"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {

	dsn := "user=postgres.furtldrpqmnfqonpskhx password=bikwoh-manhEs-xiwqo0 host=aws-0-us-east-1.pooler.supabase.com port=6543 dbname=postgres"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("Failed to connecct to database:", err)
	}

	db.AutoMigrate((&models.Session{}))

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	r.POST(
		"/sessions",
		func(c *gin.Context) {
			var session models.Session
			if err := c.ShouldBindJSON(&session); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{
					"error": err.Error()})
				return
			}

			if err := db.Create(&session).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, session)
		},
	)

	r.DELETE("/clear-database", func(c *gin.Context) {
		if err := db.Exec("DELETE FROM sessions").Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Database cleared"})
	})
	r.GET(
		"/sessions",
		func(c *gin.Context) {
			pageStr := c.DefaultQuery("page", "1")
			page, err := strconv.Atoi(pageStr)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page number"})
				return
			}

			limit := 100
			offset := (page - 1) * limit

			var sessions []models.Session
			if err := db.Offset(offset).Limit(limit).Find(&sessions).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, sessions)
		},
	)

	r.GET(
		"/filter-by-topic",
		func(c *gin.Context) {
			topic := c.Query("topic")
			avgScore, err := calculations.FilterByTopic(db, topic)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, gin.H{"average_score": avgScore})
		},
	)

	r.GET(
		"/top-topics",
		func(c *gin.Context) {
			n, err := strconv.Atoi(c.Query("n"))
			if err != nil || n <= 0 {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid number of topics"})
				return
			}
			weakest := c.Query("weakest") == "true"

			topics, err := calculations.GetTopNTopicsByAverageScore(db, n, weakest)

			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, gin.H{"topics": []string(topics)})
		},
	)
	r.Run()
}
