import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScoreList from './ScoreList';
import { getStats } from '../api'; 
import { Link } from 'react-router-dom';

const StatsPage = () => {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const stats = await getStats(); 
                setScores(stats.scores);
            } catch (error) {
                console.error('Error fetching stats:', error);
                setError('Failed to fetch statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="stats-page">
            <Link to="http://localhost:3000" style={{ textDecoration: 'none' }}>
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
            <h2>Statistics</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {scores?.length > 0 ? (
                <ScoreList scores={scores} />
            ) : (
                !loading && <p>No statistics available</p>
            )}
        </div>
    );
};

export default StatsPage;
