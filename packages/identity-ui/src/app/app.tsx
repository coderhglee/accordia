// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import React from 'react';
import { Routes, Route, useParams, useSearchParams } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import { ConsentPage } from './components/ConsentPage';
import './components/identity.css';
import { ErrorPage } from './components/ErrorPage';

// 메인 App 컴포넌트
function App() {
  return (
    <Routes>
      <Route path="/interaction/:uid/login" element={<LoginHandler />} />
      <Route path="/interaction/:uid/consent" element={<ConsentHandler />} />
      <Route path="/interaction/:uid/error" element={<ErrorHandler />} />
      <Route path="/" element={<WelcomePage />} />
    </Routes>
  );
}

// 로그인 핸들러
function LoginHandler() {
  const { uid } = useParams<{ uid: string }>();
  if (!uid) return <ErrorHandler />;
  return <LoginPage uid={uid} />;
}

// Consent 핸들러
function ConsentHandler() {
  const { uid } = useParams<{ uid: string }>();
  if (!uid) return <ErrorHandler />;
  return <ConsentPage uid={uid} />;
}

// 에러 핸들러
function ErrorHandler() {
  const { uid } = useParams<{ uid: string }>();
  const [searchParams] = useSearchParams();
  const errorType = searchParams.get('type');
  const error = searchParams.get('error');

  return <ErrorPage uid={uid} errorType={errorType} error={error} />;
}

// 웰컴 페이지
function WelcomePage() {
  return (
    <div className="container">
      <div className="header">
        <h1>🔐 Identity Provider</h1>
        <p>Secure authentication for your applications</p>
      </div>
      <div className="body">
        <h2>Welcome to Identity Provider</h2>
        <p>This is the identity provider for your applications. To begin authentication, please use the proper OIDC flow.</p>

        <div style={{ marginTop: '30px' }}>
          <h3>🚀 Quick Start</h3>
          <p style={{ marginBottom: '15px' }}>
            Use this URL to start the authentication flow:
          </p>
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px' }}>
            http://localhost:3000/oidc/auth?client_id=test-client&response_type=code&scope=openid%20profile%20email&redirect_uri=http://localhost:3000/oidc/test/callback
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
