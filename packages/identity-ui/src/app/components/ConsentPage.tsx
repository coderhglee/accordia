import React from 'react';

interface ConsentPageProps {
    uid: string;
}

export const ConsentPage: React.FC<ConsentPageProps> = ({ uid }) => {
    const handleConsent = (accept: boolean) => {
        const form = document.createElement('form');
        form.method = 'post';
        form.action = `/interaction/${uid}/${accept ? 'confirm' : 'reject'}`;
        document.body.appendChild(form);
        form.submit();
    };

    return (
        <div className="container consent-container">
            <div className="header">
                <h1>🔐 Authorization Request</h1>
                <p>Review the permissions being requested</p>
            </div>
            <div className="body">
                <div style={{ marginBottom: '30px', padding: '20px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                    <h3>test-client</h3>
                    <p style={{ color: '#718096' }}>wants to access your account</p>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ marginBottom: '16px' }}>📋 Requested Permissions</h3>
                    <div className="permission-item">
                        <div className="permission-icon">🔐</div>
                        <div>
                            <div style={{ fontWeight: '600', fontSize: '14px' }}>OpenID Connect</div>
                            <div style={{ fontSize: '12px', color: '#718096' }}>Basic authentication information</div>
                        </div>
                    </div>
                    <div className="permission-item">
                        <div className="permission-icon">👤</div>
                        <div>
                            <div style={{ fontWeight: '600', fontSize: '14px' }}>Profile Information</div>
                            <div style={{ fontSize: '12px', color: '#718096' }}>Your name, username, and profile picture</div>
                        </div>
                    </div>
                    <div className="permission-item">
                        <div className="permission-icon">📧</div>
                        <div>
                            <div style={{ fontWeight: '600', fontSize: '14px' }}>Email Address</div>
                            <div style={{ fontSize: '12px', color: '#718096' }}>Your email address and verification status</div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={() => handleConsent(false)}
                        style={{ flex: 1 }}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => handleConsent(true)}
                        style={{ flex: 1 }}
                    >
                        Allow Access
                    </button>
                </div>

                <div style={{ marginTop: '20px', padding: '16px', background: '#fef3c7', borderRadius: '8px', fontSize: '12px', color: '#92400e', textAlign: 'center' }}>
                    🔒 Your data will be shared securely. You can revoke access at any time.
                </div>
            </div>
        </div>
    );
}; 