import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface LoginPageProps {
    uid: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ uid }) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [searchParams] = useSearchParams();

    const error = searchParams.get('error');

    const fillDemo = (username: string, pwd: string) => {
        setLogin(username);
        setPassword(pwd);
    };

    const getErrorMessage = (errorCode: string): string => {
        switch (errorCode) {
            case 'missing_credentials':
                return 'Please enter both username and password.';
            case 'invalid_credentials':
                return 'Invalid username or password. Please try again.';
            case 'server_error':
                return 'A server error occurred. Please try again.';
            default:
                return `An error occurred: ${errorCode}`;
        }
    };

    // Demo users (하드코딩된 데이터 - 필요시 API로 가져올 수 있음)
    const demoUsers = [
        { username: 'admin', email: 'admin@example.com', name: 'Administrator' },
        { username: 'user1', email: 'user1@example.com', name: 'John Doe' },
        { username: 'user2', email: 'user2@example.com', name: 'Jane Smith' },
    ];

    return (
        <div className="container login-container">
            <div className="header">
                <h1>🔐 Sign In</h1>
                <p>Welcome to Identity Provider</p>
            </div>
            <div className="body">
                {error && (
                    <div className="error">
                        {getErrorMessage(error)}
                    </div>
                )}

                {/* Form 제출 */}
                <form method="post" action={`/interaction/${uid}`}>
                    <div className="form-group">
                        <label>Username or Email</label>
                        <input
                            type="text"
                            name="login"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Sign In
                    </button>
                </form>

                <div style={{ marginTop: '30px' }}>
                    <h3>🚀 Demo Accounts</h3>
                    <p style={{ marginBottom: '15px', color: '#718096', fontSize: '14px' }}>
                        Click to auto-fill:
                    </p>
                    {demoUsers.map(user => (
                        <div
                            key={user.username}
                            className="demo-user"
                            onClick={() => fillDemo(user.username, user.username === 'admin' ? 'admin123' : 'password123')}
                        >
                            <div style={{ fontWeight: '600' }}>{user.name}</div>
                            <div style={{ fontSize: '12px', color: '#718096' }}>{user.email}</div>
                            <div style={{ fontSize: '12px', color: '#667eea' }}>@{user.username}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}; 