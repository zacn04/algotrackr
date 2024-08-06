import React from 'react';
import { useNavigate } from 'react-router-dom';
import { clearDatabase } from '../api';

const HomePage = () => {
    const navigate = useNavigate();

    const handleStart = async () => {
        try {
            navigate('/form');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleLoad = async () => {
        try {
            navigate('/sessions');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="container">
            <h1>LeetTrack</h1>
            <button onClick={handleStart}>New Session</button>
            <button onClick={handleLoad}>Load Sessions</button>
        </div>
    );
};

export default HomePage;
