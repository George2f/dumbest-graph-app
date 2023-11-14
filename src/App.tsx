import { useState } from 'react';
import Dashboard from './Dashboard';
import Graph from './Graph';
import HeaderModule from './modules/HeaderModule';

export default function App() {
    const [route, setRoute] = useState<string>('dashboard');

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateRows: 'auto 1fr auto',
                height: 'calc(100vh - 16px)',
                color: 'darkslategray',
            }}>
            <header>
                <HeaderModule />
                <div>
                    <button onClick={() => setRoute('dashboard')}>
                        Dashboard
                    </button>
                    <button onClick={() => setRoute('graph')}>Graph</button>
                </div>
            </header>
            {route === 'dashboard' ? <Dashboard /> : null}
            {route === 'graph' ? <Graph /> : null}
            <footer></footer>
        </div>
    );
}
