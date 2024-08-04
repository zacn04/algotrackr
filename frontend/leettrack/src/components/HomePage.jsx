import React from 'react';
import { useNavigate } from 'react-router-dom';
import { clearDatabase } from '../api';

const HomePage = () => {
    const navigate = useNavigate();

    const handleStart = async () => {
        try {
            await clearDatabase();
            navigate('/form');
        } catch (error) {
            console.error('Error clearing the database:', error);
        }
    };

    return (
        <div className="container">
            <button onClick={handleStart}>New Session</button>
        </div>
    );
};

export default HomePage;
