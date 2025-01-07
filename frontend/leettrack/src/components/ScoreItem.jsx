import React from 'react';

const ScoreItem = ({ Topic, AvgScore }) => {
    return (
        <div className="score-item">
            <div className="score-topic">{Topic}</div>
            <div className={`score-value ${getScoreClass(AvgScore)}`}>{AvgScore}</div>
        </div>
    );
};

const getScoreClass = (score) => {
    if (score >= 90) return 'score-high';
    if (score >= 70) return 'score-medium';
    return 'score-low';
};

export default ScoreItem;
