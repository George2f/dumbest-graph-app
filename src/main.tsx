import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import GraphProvider from './providers/GraphProvider';
import HistoryProvider from './providers/HistoryProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <GraphProvider>
            <HistoryProvider>
                <App />
            </HistoryProvider>
        </GraphProvider>
    </React.StrictMode>
);
