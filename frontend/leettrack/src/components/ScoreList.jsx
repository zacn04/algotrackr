import React from 'react';
import ScoreItem from './ScoreItem'; 

const ScoreList = ({ scores }) => {
  return (
    <div className="score-list">
      {scores.map((score, index) => (
        <ScoreItem
          key={index}
          Topic={score.Topic}
          AvgScore={score.AvgScore}
        />
      ))}
    </div>
  );
};

export default ScoreList;
