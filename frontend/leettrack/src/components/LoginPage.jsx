import React from 'react';
import { supabase } from '../supabaseClient';

const LoginPage = () => {
  const signInWithGitHub = async () => {
    const { user, session, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });
    if (error) console.error('Error:', error.message);
    else console.log('Logged in successfully!');
  };

  return (
    <div>
      <h1>Sign in with GitHub</h1>
      <button onClick={signInWithGitHub}>Sign in with GitHub</button>
    </div>
  );
};

export default LoginPage;
