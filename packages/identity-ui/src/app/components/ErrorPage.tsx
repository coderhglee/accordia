import React from 'react';

interface ErrorPageProps {
    uid?: string;
    errorType?: string | null;
    error?: string | null;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ uid, errorType, error }) => {
    const getErrorMessage = (errorCode: string): string => {
        switch (errorCode) {
            case 'missing_credentials':
                return 'Please enter both username and password.';
            case 'invalid_credentials':
                return 'Invalid username or password. Please try again.';
            case 'server_error':
                return 'A server error occurred. Please try again.';
            case 'invalid_session':
                return 'Invalid or expired interaction session. Please restart the authentication process.';
            case 'unknown_prompt':
                return 'Unknown interaction type. Please restart the authentication process.';
            default:
                return `An error occurred: ${errorCode}`;
        }
    };

    const errorMessage = error ? getErrorMessage(error) :
        errorType ? getErrorMessage(errorType) :
            'An unknown error occurred.';

    return (
        <div className="container">
            <div className="header">
                <h1>❌ Error</h1>
            </div>
            <div className="body">
                <div className="error">{errorMessage}</div>
                {uid && error && (error === 'missing_credentials' || error === 'invalid_credentials') && (
                    <a
                        href={`/interaction/${uid}/login`}
                        className="btn btn-secondary"
                        style={{ marginRight: '10px' }}
                    >
                        Try Again
                    </a>
                )}
                <a
                    href="/oidc/auth?client_id=test-client&response_type=code&scope=openid%20profile%20email&redirect_uri=http://localhost:3000/oidc/test/callback"
                    className="btn btn-primary"
                >
                    Restart Authentication
                </a>
            </div>
        </div>
    );
}; 