import React, { useState } from 'react';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true); // true = login, false = create account
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // only for create account

  const handleSubmit = async (e) => {
  e.preventDefault();
  const userData = {
    email,
    fullName: name,  // map name field to fullName
    password,
    authProvider: 'LOCAL'
  };

  if (isLogin) {
    // call login API
  } else {
    // call create account API
    try {
      const response = await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/users", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, name, password }),
});
      const data = await response.json();
      console.log('Account created:', data);
    } catch (error) {
      console.error('Error creating account:', error);
    }
  }
};


  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <h2 style={{ textAlign: 'center' }}>{isLogin ? 'Login' : 'Create Account'}</h2>

        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ marginBottom: '10px', padding: '8px' }}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ marginBottom: '10px', padding: '8px' }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ marginBottom: '10px', padding: '8px' }}
        />

        <button
          type="submit"
          style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          {isLogin ? 'Login' : 'Create Account'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '10px', cursor: 'pointer', color: '#007bff' }}
           onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Don’t have an account? Create one' : 'Already have an account? Login'}
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
