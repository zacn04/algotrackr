import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import FormComponent from './components/FormComponent';
import HomePage from './components/HomePage';
import SessionsList from './components/SessionsList';  
import StatsPage from './components/StatsPage';
import AboutPage from './components/AboutPage.tsx';

const App = () => {
    return (
        <Router>
            <div className="container" style={{ padding: '50px 0 100px 0' }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/form" element={<FormComponent />} />
                    <Route path="/sessions" element={<SessionsList />} />
                    <Route path="/statistics" element={<StatsPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="*" element={<h1>404: Page Not Found</h1>} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
