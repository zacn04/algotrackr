import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FormComponent from './components/FormComponent';
import HomePage from './components/HomePage';
import SessionsList from './components/SessionsList';

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/form" element={< FormComponent 
                      />} />
                    <Route path="/" element={< HomePage/>} />
                    <Route path="/sessions" element={< SessionsList/>} />
                    <Route path="*" element={<h1>404: Page Not Found</h1>} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;