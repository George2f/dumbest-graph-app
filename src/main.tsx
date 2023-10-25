import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import GraphProvider from './providers/GraphProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <GraphProvider>
            <App />
        </GraphProvider>
    </React.StrictMode>
);
