import React from 'react';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import { Amplify } from 'aws-amplify';
import awsmobile from './aws-exports';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(awsmobile);

function App() {
  return (
    <Authenticator
      signUpAttributes={['email']}
      formFields={{
        signUp: {
          email: {
            order: 1,
            placeholder: 'Enter your email address',
            isRequired: true,
            label: 'Email:'
          },
          password: {
            order: 2,
            placeholder: 'Enter your password',
            isRequired: true,
            label: 'Password:'
          },
          confirm_password: {
            order: 3,
            placeholder: 'Confirm your password',
            isRequired: true,
            label: 'Confirm Password:'
          }
        }
      }}
    >
      {({ signOut, user }) => (
        <div className="App">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px',
            padding: '10px',
            backgroundColor: '#f5f5f5',
            borderRadius: '5px'
          }}>
            <h1>Finance Tracker</h1>
            <div>
              <span style={{ marginRight: '15px' }}>
                Welcome, {user.attributes?.email || user.username}!
              </span>
              <button 
                onClick={signOut}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
          
          <TransactionForm />
          <TransactionList />
        </div>
      )}
    </Authenticator>
  );
}

export default App;