import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import GraphProvider from './providers/GraphProvider';
import HistoryProvider from './providers/HistoryProvider';
import LocalStoragePersistenceProvider from './providers/LocalStoragePersistenceProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <LocalStoragePersistenceProvider>
            <GraphProvider defaultGraphId="graph">
                <HistoryProvider>
                    <App />
                </HistoryProvider>
            </GraphProvider>
        </LocalStoragePersistenceProvider>
    </React.StrictMode>
);
