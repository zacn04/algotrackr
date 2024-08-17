import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import FormComponent from './components/FormComponent';
import HomePage from './components/HomePage';
import SessionsList from './components/SessionsList';
import Signup from './components/SignUp';
import Login from './components/Login';     
import Auth from './Auth';
import Account from './Account';

const App = () => {
    const [session, setSession] = useState(null);

    useEffect(() => {
        console.log(process.env.VITE_SUPABASE_URL)
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
          })
      
          supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
          })
        }, [])

    const ProtectedRoute = ({ element }) => {
        return session ? element : <Navigate to="/login" />;
    }

    return (
        <Router>
            <div className="container" style={{ padding: '50px 0 100px 0' }}>
                {!session ? (
                    <Auth />
                ) : (
                    <Account key={session.user.id} session={session} />
                )}
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/form" element={<ProtectedRoute element={<FormComponent />} />} />
                    <Route path="/sessions" element={<ProtectedRoute element={<SessionsList />} />} />
                    <Route path="*" element={<h1>404: Page Not Found</h1>} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
