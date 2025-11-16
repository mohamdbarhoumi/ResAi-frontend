import React, { useState } from 'react';
import { API_URL } from "@/src/config/api";
function LoginPage() {
  const [isLogin, setIsLogin] = useState(true); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Check if API URL is defined
  
    if (!API_URL) {
      setError('⚠️ Configuration error. Please contact support.');
      console.error('❌ NEXT_PUBLIC_API_URL is undefined!');
      setLoading(false);
      return;
    }

    if (isLogin) {
      // LOGIN
      try {
        console.log('🔍 Login URL:', `${API_URL}/api/users/login`);
        
        const response = await fetch(`${API_URL}/api/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Login failed");
        }

        const data = await response.json();
        console.log("✅ Login success:", data);

        // Save JWT token
        localStorage.setItem("token", data.token);

        // Redirect to dashboard
        window.location.href = "/dashboard";
      } catch (error) {
        console.error("❌ Login error:", error);
        setError(error.message || "Login failed. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      // SIGNUP
      try {
        console.log('🔍 Signup URL:', `${API_URL}/api/users/create`);
        
        const response = await fetch(`${API_URL}/api/users/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            email, 
            fullName: name,  // Match your backend's expected field name
            password,
            authProvider: 'LOCAL'
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Account creation failed");
        }

        const data = await response.json();
        console.log('✅ Account created:', data);
        
        // Auto-switch to login after successful signup
        setError('');
        alert('✅ Account created! Please login.');
        setIsLogin(true);
        setPassword(''); // Clear password for security
      } catch (error) {
        console.error('❌ Signup error:', error);
        setError(error.message || "Failed to create account. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '350px', padding: '30px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
          {isLogin ? 'Login' : 'Create Account'}
        </h2>

        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ padding: '8px', backgroundColor: '#fff3cd', fontSize: '11px', marginBottom: '10px', borderRadius: '4px' }}>
            API: {API_URL || 'NOT SET'}
          </div>
        )}

        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
        />

        {error && (
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            border: '1px solid #f5c6cb',
            borderRadius: '4px', 
            marginBottom: '10px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ 
            padding: '12px', 
            backgroundColor: loading ? '#6c757d' : '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            fontSize: '16px'
          }}
        >
          {loading ? (isLogin ? 'Logging in...' : 'Creating account...') : (isLogin ? 'Login' : 'Create Account')}
        </button>

        <p style={{ 
          textAlign: 'center', 
          marginTop: '15px', 
          cursor: 'pointer', 
          color: '#007bff',
          fontSize: '14px'
        }}
           onClick={() => {
             setIsLogin(!isLogin);
             setError('');
           }}>
          {isLogin ? "Don't have an account? Create one" : 'Already have an account? Login'}
        </p>
      </form>
    </div>
  );
}

export default LoginPage;