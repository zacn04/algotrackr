import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; 

const HomePage = () => {
    const navigate = useNavigate();
    const [session, setSession] = useState(null);

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
        };

        fetchSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleStart = () => {
        if (session) {
            navigate('/form');
        } else {
            navigate('/login');
        }
    };

    const handleLoad = () => {
        if (session) {
            navigate('/sessions');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="container">
            <h2>AlgoTrackr</h2>
                    <button onClick={handleStart}>New Session</button>
                    <button onClick={handleLoad}>Load Sessions</button>
        </div>
    );
};

export default HomePage;
