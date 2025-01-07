import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    const handleStart = () => {
        navigate('/form');
    };

    const handleLoad = () => {
        navigate('/sessions');
    };

    const handleAbout = () => {
        navigate('/about');
    }

    const handleStats = () => {
        navigate('/statistics');
    };

    return (
        <div className="container">
            <h2>AlgoTrackr</h2>
                    <button onClick={handleAbout}>About</button>
                    <button onClick={handleStart}>New Session</button>
                    <button onClick={handleLoad}>Load Sessions</button>
                    <button onClick={handleStats}>User Profile</button>
        </div>
    );
};

export default HomePage;
