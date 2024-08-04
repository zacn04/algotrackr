import React, { useState, useEffect } from 'react';
import { getSessions } from '../api';

const SessionsList = () => {
  const [sessions, setSessions] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Adjust as needed
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await getSessions(); // No page parameter
        console.log('Fetched sessions data:', data);
        setSessions(data);
      } catch (error) {
        console.error('Error loading sessions:', error);
      }
    };

    loadSessions();
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredSessions = sessions.filter(session =>
    session.problemName.toLowerCase().includes(filter.toLowerCase())
  );

  // Pagination logic
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSessions = filteredSessions.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);

  return (
    <div style={{ padding: '20px' }}>
      <input
        type="text"
        placeholder="Filter by problem name"
        value={filter}
        onChange={handleFilterChange}
        style={{ marginBottom: '20px', padding: '10px', width: '100%' }}
      />
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
      <div>
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
  );
};

// Color interpolation function
const interpolateColor = (score) => {
  const minScore = 0;
  const maxScore = 100;

  const red = Math.max(255 - ((score - minScore) / (maxScore - minScore)) * 255, 0);
  const green = Math.max(((score - minScore) / (maxScore - minScore)) * 255, 0);
  const color = `rgb(${red}, ${green}, 0)`;

  return color;
};

export default SessionsList;
