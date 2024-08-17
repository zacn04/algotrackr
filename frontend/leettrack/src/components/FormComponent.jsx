import React, { useState, useEffect } from 'react';
import { postSession, getSessions, clearDatabase } from '../api';
import '../styles.css';
import SessionsList from './SessionsList';
import { supabase } from '../supabaseClient';

const interpolateColor = (value, minValue, maxValue) => {
  const normalizedValue = Math.max(0, Math.min(1, (value - minValue) / (maxValue - minValue)));
  const startColor = { r: 255, g: 0, b: 0 }; // Red
  const midColor = { r: 255, g: 255, b: 0 }; // Yellow
  const endColor = { r: 0, g: 255, b: 0 };   // Green

  let color;
  if (normalizedValue < 0.5) {
    color = {
      r: Math.floor(startColor.r + (midColor.r - startColor.r) * (normalizedValue * 2)),
      g: Math.floor(startColor.g + (midColor.g - startColor.g) * (normalizedValue * 2)),
      b: Math.floor(startColor.b + (midColor.b - startColor.b) * (normalizedValue * 2))
    };
  } else {
    color = {
      r: Math.floor(midColor.r + (endColor.r - midColor.r) * ((normalizedValue - 0.5) * 2)),
      g: Math.floor(midColor.g + (endColor.g - midColor.g) * ((normalizedValue - 0.5) * 2)),
      b: Math.floor(midColor.b + (endColor.b - midColor.b) * ((normalizedValue - 0.5) * 2))
    };
  }

  return `rgb(${color.r}, ${color.g}, ${color.b})`;
};

const fetchUserId = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id;
};

const FormComponent = () => {
  const [formData, setFormData] = useState({
    problemName: '',
    topics: [],
    attempts: '',
    timeSpent: '',
    trafficLight: '',
  });

  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [showScore, setShowScore] = useState(true);
  const [showButtons, setShowButtons] = useState(true);

  useEffect(() => {
    if (score !== null) {
      const timer = setTimeout(() => {
        setShowScore(false);
        setShowButtons(false);
      }, 5000); // Hide after 5 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [score]);

  const handleClearSessions = async () => {
    try {
      await clearDatabase();
      alert('Sessions cleared successfully');
    } catch (error) {
      console.error('Error clearing sessions:', error);
      alert('Failed to clear sessions');
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'select-multiple') {
      const options = e.target.options;
      const selectedValues = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selectedValues.push(options[i].value);
        }
      }
      setFormData(prevState => ({
        ...prevState,
        [name]: selectedValues
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const getScoreColor = (score) => {
    return interpolateColor(score, 0, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = await fetchUserId();

    if (!userId) {
      console.error('User ID not found!');
      return;
    }


    const formattedData = {
      ...formData,
      userId,
      attempts: parseInt(formData.attempts, 10),
      timeSpent: parseFloat(formData.timeSpent)
    };

    try {
      const response = await postSession(formattedData);
      console.log('Form submitted successfully!', response);
      setScore(response.score);
      setShowScore(true);
      setShowButtons(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input 
              type="text" 
              name="problemName" 
              value={formData.problemName} 
              onChange={handleChange} 
            />
          </label>
        </div>

        <div>
          <label>
            Topic:
            <select 
              name="topics" 
              value={formData.topics} 
              onChange={handleChange}
              multiple
            >
              <option value="Array">Array</option>
              <option value="Hash Table">Hash Table</option>
              <option value="Prefix Sum">Prefix Sum</option>
              <option value="Sliding Window">Sliding Window</option>
              <option value="Two Pointers">Two Pointers</option>
              <option value="String">String</option>
              <option value="Linked List">Linked List</option>
              <option value="Stack">Stack</option>
              <option value="Queue">Queue</option>
              <option value="Tree">Tree</option>
              <option value="Heap (Priority Queue)">Heap (Priority Queue)</option>
              <option value="Graph">Graph</option>
              <option value="Dynamic Programming">Dynamic Programming</option>
              <option value="Greedy">Greedy</option>
              <option value="Backtracking">Backtracking</option>
              <option value="Matrix">Matrix</option>
              <option value="Math">Math</option>
              <option value="Bit Manipulation">Bit Manipulation</option>
              <option value="Geometry">Geometry</option>
              <option value="Concurrency">Concurrency</option>
              <option value="Game Theory">Game Theory</option>
              <option value="Simulation">Simulation</option>
            </select>
          </label>
        </div>

        <div>
          <label>
            Attempts:
            <input 
              type="text" 
              name="attempts" 
              value={formData.attempts} 
              onChange={handleChange} 
            />
          </label>
        </div>

        <div>
          <label>
            Time Spent (mins):
            <input 
              type="text" 
              name="timeSpent" 
              value={formData.timeSpent} 
              onChange={handleChange} 
            />
          </label>
        </div>

        <div className="radio-group">
          <label>
            Traffic Light:
          </label>
          <label>
            <input 
              type="radio" 
              name="trafficLight" 
              value="red" 
              checked={formData.trafficLight === 'red'} 
              onChange={handleChange} 
            />
            Red
          </label>
          <label>
            <input 
              type="radio" 
              name="trafficLight" 
              value="yellow" 
              checked={formData.trafficLight === 'yellow'} 
              onChange={handleChange} 
            />
            Yellow
          </label>
          <label>
            <input 
              type="radio" 
              name="trafficLight" 
              value="green" 
              checked={formData.trafficLight === 'green'} 
              onChange={handleChange} 
            />
            Green
          </label>
        </div>

        <button type="submit">Submit</button>
      </form>

      {score !== null && showScore && (
        <div>
          <h1>Your score is: <span style={{ color: getScoreColor(score), fontWeight: 'bold' }}>{score}</span></h1>
          {showButtons && (
            <div className="button-group">
              <button
                title="See past session data"
                onClick={() => window.open('/sessions', '_blank')}
                style={{ marginTop: '20px' }}
              >
                Get Sessions
              </button>
            </div>
          )}
        </div>
      )}
      {loading && <p>Loading sessions...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {sessions.length > 0 && <SessionsList sessions={sessions} />}
    </div>
  );
};

export default FormComponent;
