import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { postSession, getSessions} from '../api';
import '../styles.css';
import { useNavigate } from 'react-router-dom';
import SessionsList from './SessionsList';
import { API_BASE_URL } from '../constants';



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
  return 1;
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
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (score !== null) {
      const timer = setTimeout(() => {
        setShowScore(false);
        setShowButtons(false);
      }, 10000); 

      return () => clearTimeout(timer); 
    }
  }, [score]);

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

    if (name === 'attempts') {
      if (isNaN(value) || value <= 0) {
        setError('Attempts must be a positive number.');
      } else {
        setError(null);
      }
    } else if (name === 'timeSpent') {
      if (isNaN(value) || value < 0) {
        setError('Time Spent must be a non-negative number.');
      } else {
        setError(null);
      }
    }
  };

  const getScoreColor = (score) => {
    return interpolateColor(score, 0, 100);
  };

  const handleGetSessions = async () => {
    const userId = 1;

    if (!userId) {
      console.error('User ID not found!');
      return;
    }

    setLoading(true);
    try {
        const fetchedSessions = await getSessions();
        if (fetchedSessions) {
          setSessions(fetchedSessions);
          navigate('/sessions');
        } else {
          throw new Error("!");
        }
        
        
    } catch (error) {
        console.error('Error fetching sessions:', error);
        setError('Failed to fetch sessions');
    } finally {
        setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevents the default form submission action

    const { problemName, topics, attempts, timeSpent, trafficLight } = formData;

    // Validation checks
    if (!problemName || topics.length === 0 || !trafficLight) {
      alert('Please fill in all required fields.');
      return;
    }

    if (isNaN(attempts) || attempts <= 0) {
      alert('Attempts must be a positive number.');
      return;
    }

    if (isNaN(timeSpent) || timeSpent < 0) {
      alert('Time Spent must be a non-negative number.');
      return;
    }

    try {
      const userId = 1;

      if (!userId) {
        console.error('User ID not found!');
        return;
      }

      const formattedData = {
        ...formData,
        userId,
        attempts: parseInt(attempts, 10),
        timeSpent: parseFloat(timeSpent),
      };

      const response = await postSession(formattedData);
      setScore(response.score);
      setShowScore(true);
      setShowButtons(true);
      setSubmitDisabled(true);
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
    }
  };


  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Problem Name:
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
            Your Understanding (Traffic Light):
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
      <button type="submit" disabled={submitDisabled}>
        {submitDisabled ? 'Submitted' : 'Submit'}
        </button>
      </form>

      {score !== null && showScore && (
        <div>
          <h1>Your score is: <span style={{ color: getScoreColor(score), fontWeight: 'bold' }}>{score}</span></h1>
          {showButtons && (
            <div className="button-group">
              <button
                title="See past session data"
                onClick={handleGetSessions}
                style={{ display: submitDisabled ? 'block' : 'none' }}
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
