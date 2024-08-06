import React, { useState, useEffect } from 'react';
import { getSessions, getTopNTopics } from '../api';
import { Link } from 'react-router-dom';

const SessionsList = () => {
  const [sessions, setSessions] = useState([]);
  const [page, setPage] = useState(1);
  const [topTopics, setTopTopics] = useState([]);
  const [selectedTopN, setSelectedTopN] = useState(5);
  const [weakest, setWeakest] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filter, setFilter] = useState('');
  const [filterBy, setFilterBy] = useState('problemName');

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const sessionData = await getSessions();
        setSessions(sessionData);
      } catch (error) {
        console.error('Error loading sessions:', error);
      }
    };

    loadSessions();
  }, []);

  useEffect(() => {
    if (filterBy === 'topTopics') {
      const loadTopTopics = async () => {
        try {
          const data = await getTopNTopics(selectedTopN, weakest);
          setTopTopics(data.topics || []);
        } catch (error) {
          console.error('Error loading top topics:', error);
        }
      };

      loadTopTopics();
    }
  }, [selectedTopN, weakest, filterBy]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleFilterByChange = (e) => {
    setFilterBy(e.target.value);
  };

  const handleTopNChange = (e) => {
    setSelectedTopN(parseInt(e.target.value, 10));
  };

  const filteredSessions = sessions.filter(session => {
    if (filterBy === 'problemName') {
      return session.problemName.toLowerCase().includes(filter.toLowerCase());
    }
    if (filterBy === 'topicName') {
      return session.topics.some(topic => topic.toLowerCase().includes(filter.toLowerCase()));
    }
    if (filterBy === 'topTopics') {
      return session.topics.some(topic => topTopics.includes(topic));
    }
    return true;
  });

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSessions = filteredSessions.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);

  return (
<div style={{ padding: '20px' }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <button
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            padding: '10px 20px',
            fontSize: '16px',
          }}
        >
          Back to Home
        </button>
      </Link>
    <div style={{ padding: '20px' }}>
      <div className="filter-container">
        <label>
          Filter By:
          <select value={filterBy} onChange={handleFilterByChange} className="filter-select">
            <option value="problemName">Problem Name</option>
            <option value="topicName">Topic Name</option>
            <option value="topTopics">Top Topics</option>
          </select>
        </label>

        {filterBy === 'topTopics' && (
          <div className="filter-top-topics">
            <label>
              Weakest:
              <input
                type="checkbox"
                checked={weakest}
                onChange={() => setWeakest(!weakest)}
              />
            </label>
            <label style={{ marginTop: '10px' }}>
              Number of Topics:
              <select value={selectedTopN} onChange={handleTopNChange} className="topn-select">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="8">8</option>
              </select>
            </label>
          </div>
        )}

        {filterBy !== 'topTopics' && (
          <div className="filter-input">
            <label>
              Filter:
              <input
                type="text"
                placeholder={`Filter by ${filterBy}`}
                value={filter}
                onChange={handleFilterChange}
              />
            </label>
          </div>
        )}
      </div>

      <table>
        <thead>
          <tr>
            <th>Problem Name</th>
            <th>Date</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {paginatedSessions.length > 0 ? (
            paginatedSessions.map((session) => (
              <tr key={session.ID}>
                <td>{session.problemName || 'N/A'}</td>
                <td>{new Date(session.date).toLocaleDateString()}</td>
                <td style={{ color: interpolateColor(session.score) }}>
                  <strong>{session.score}</strong>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No sessions found</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination-controls">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </button>
        <span> Page {page} of {totalPages} </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  </div>
  );
};


const interpolateColor = (score) => {
  const minScore = 0;
  const maxScore = 100;

  const red = Math.max(255 - ((score - minScore) / (maxScore - minScore)) * 255, 0);
  const green = Math.max(((score - minScore) / (maxScore - minScore)) * 255, 0);
  const color = `rgb(${red}, ${green}, 0)`;

  return color;
};

export default SessionsList;
