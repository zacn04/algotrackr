package calculations

import (
	"github.com/lib/pq"
	"gorm.io/gorm"
)

func FilterByTopic(db *gorm.DB, topic string) (float64, error) {
	var averageScore float64
	err := db.Raw(`
        SELECT AVG(score)
        FROM sessions
        WHERE ? = ANY(topics)
    `, topic).Scan(&averageScore).Error
	return averageScore, err
}
func GetTopNTopicsByAverageScore(db *gorm.DB, n int, weakest bool) (pq.StringArray, error) {
	var topicScores []struct {
		Topic    string
		AvgScore float64
	}

	order := "DESC"
	if weakest {
		order = "ASC"
	}

	query := `
		SELECT topic, AVG(score) as avg_score
		FROM (
			SELECT unnest(topics) AS topic, score
			FROM sessions
		) AS subquery
		GROUP BY topic
		ORDER BY avg_score ` + order + `
		LIMIT ?
	`

	err := db.Raw(query, n).Scan(&topicScores).Error
	if err != nil {
		return nil, err
	}

	var topics pq.StringArray
	for _, ts := range topicScores {
		topics = append(topics, ts.Topic)
	}

	return topics, nil
}

func FilterByAverageTimeSpent(db *gorm.DB, topic string) (float64, error) {
	var averageTimeSpent float64
	err := db.Raw(`
		SELECT COALESCE(AVG(time_spent), 0)
		FROM sessions
		WHERE ? = ANY(topics)
	`,
		topic).Scan(&averageTimeSpent).Error
	return averageTimeSpent, err
}
