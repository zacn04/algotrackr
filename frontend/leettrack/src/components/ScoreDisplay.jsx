import React, { useState, useEffect } from 'react';

const ScoreDisplay = ({ score }) => {
    const [scoreColor, setScoreColor] = useState('gray');

    useEffect(() => {
        setScoreColor(getScoreColor(score));
    }, [score]);

    return (
        <div>
            <h1 style={{ color: scoreColor }}>Your score is: {score}</h1>
        </div>
    );
};

const getScoreColor = (score) => {
    if (score <= 20) return 'red';
    if (score <= 50) return 'yellow';
    if (score <= 100) return 'green';
    return 'gray';  
};

export default ScoreDisplay;
