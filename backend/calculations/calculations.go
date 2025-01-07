package calculations

import (
	"log"

	"github.com/lib/pq"
	"gorm.io/gorm"
)

type TopicScore struct {
	Topic    string `json: topic`
	AvgScore int    `json:avgscore`
}

func FilterByTopic(db *gorm.DB, topic string) (float64, error) {
	var averageScore float64
	err := db.Raw(`
        SELECT AVG(score)
        FROM sessions
        WHERE ? = ANY(topics) AND userid = ?
		ORDER BY created_at DESC
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
			WHERE userid = ?
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

func GetStats(db *gorm.DB) ([]TopicScore, error) {
	var scores []TopicScore

	log.Println("Executing GetStats")

	query := `
    SELECT
    topic AS "Topic",  
    ROUND(AVG(score))::INTEGER AS "AvgScore"
FROM
    (
        SELECT
            UNNEST(topics) AS topic,  
            score
        FROM
            sessions
		ORDER BY created_at DESC
    ) AS topic_scores
GROUP BY
    topic 
ORDER BY
    topic ASC;

`

	err := db.Raw(query).Scan(&scores).Error

	if err != nil {
		log.Println("Query Error:", err)
		return nil, err
	}

	if len(scores) == 0 {
		log.Println("No results found")
	}

	return scores, nil
}
