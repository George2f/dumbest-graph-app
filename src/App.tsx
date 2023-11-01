import { useState } from 'react';
import Dashboard from './Dashboard';
import Graph from './Graph';
import { useGraph } from './providers/GraphProvider';

export default function App() {
    const { initGraph, nodes, links, comments } = useGraph();
    const [route, setRoute] = useState<string>('dashboard');

    const [exportFileName, setExportFileName] = useState<string>('data.json');

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateRows: 'auto 1fr auto',
                height: 'calc(100vh - 16px)',
                color: "darkslategray"
            }}>
            <header>
                <h1>
                    DGA - Dumbest Graph App{' '}
                    <button
                        onClick={() => {
                            const fileInput = document.createElement('input');
                            fileInput.type = 'file';
                            fileInput.accept = 'application/json';
                            fileInput.onchange = (e) => {
                                const files = (e.target as HTMLInputElement)
                                    .files;
                                if (!files || !files[0]) return;
                                setExportFileName(files[0].name.split('.')[0]);
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                    if (!e.target || !e.target.result) return;
                                    const data = JSON.parse(
                                        e.target.result as string
                                    );
                                    initGraph(data);
                                };
                                reader.readAsText(files[0]);
                            };
                            fileInput.click();
                        }}>
                        Import
                    </button>
                    <form
                        style={{ display: 'inline' }}
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (!exportFileName) return;
                            const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
                                JSON.stringify({
                                    nodes,
                                    links,
                                    comments,
                                })
                            )}`;
                            const link = document.createElement('a');
                            link.href = jsonString;
                            link.download = `${exportFileName}.json`;

                            link.click();
                        }}>
                        <button type="submit">Export</button>
                        <input
                            value={exportFileName}
                            onChange={(e) => setExportFileName(e.target.value)}
                            type="text"
                        />
                    </form>
                </h1>
                <button onClick={() => setRoute('dashboard')}>Dashboard</button>
                <button onClick={() => setRoute('graph')}>Graph</button>
            </header>
            {route === 'dashboard' ? <Dashboard /> : null}
            {route === 'graph' ? <Graph /> : null}
            <footer>
                <p>Nodes: {nodes.length}</p>
                <p>Links: {links.length}</p>
                <p>Comments: {comments.length}</p>
            </footer>
        </div>
    );
}
