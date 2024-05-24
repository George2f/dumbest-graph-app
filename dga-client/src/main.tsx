import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import GraphProvider from './model/GraphProvider';
import HistoryProvider from './model/HistoryProvider';
import PersistenceProvider from './persistence/PersistenceProvider';

async function enableMocking() {
    if (import.meta.env.PROD) {
        return;
    }

    const worker = await import('./mock/worker');

    return worker.default.start();
}

function renderReact() {
    return ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <PersistenceProvider
                persistenceType={import.meta.env.VITE_PERSISTENCE_LAYER}>
                <GraphProvider defaultGraphId={1} defaultGraphName="graph">
                    <HistoryProvider>
                        <App />
                    </HistoryProvider>
                </GraphProvider>
            </PersistenceProvider>
        </React.StrictMode>
    );
}

if (import.meta.env.VITE_PERSISTENCE_LAYER === 'msw') {
    enableMocking().then(renderReact);
} else {
    renderReact();
}
