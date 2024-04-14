import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import GraphProvider from './providers/GraphProvider';
import HistoryProvider from './providers/HistoryProvider';
import LocalStoragePersistenceProvider from './persistence/LocalStoragePersistenceProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <LocalStoragePersistenceProvider>
            <GraphProvider defaultGraphId={1} defaultGraphName="graph">
                <HistoryProvider>
                    <App />
                </HistoryProvider>
            </GraphProvider>
        </LocalStoragePersistenceProvider>
    </React.StrictMode>
);
