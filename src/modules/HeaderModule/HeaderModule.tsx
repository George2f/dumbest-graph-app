import { useState } from 'react';
import { useGraph } from '../../providers/GraphProvider';
import { useHistory } from '../../providers/HistoryProvider';
import { useNavigate } from 'react-router-dom';

export default function HeaderModule() {
    const graph = useGraph();
    const history = useHistory();
    const navigate = useNavigate();

    const [exportFileName, setExportFileName] = useState<string>('dga-data');

    const handleExport = (e) => {
        e.preventDefault();
        if (!exportFileName) return;
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify({
                nodes: graph.nodes,
                links: graph.links,
                comments: graph.comments,
            })
        )}`;
        const link = document.createElement('a');
        link.href = jsonString;
        link.download = `${exportFileName}.json`;

        link.click();
    };

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
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
                                    graph.initGraph(data);
                                };
                                reader.readAsText(files[0]);
                            };
                            fileInput.click();
                        }}>
                        Import
                    </button>
                    <form style={{ display: 'inline' }} onSubmit={handleExport}>
                        <button type="submit">Export</button>
                        <input
                            value={exportFileName}
                            onChange={(e) => setExportFileName(e.target.value)}
                            type="text"
                        />
                    </form>
                    <button
                        onClick={(e) => {
                            handleExport(e);
                            graph.clearGraph();
                        }}>
                        Export and clear
                    </button>
                </h1>
                <div>
                    <div>Nodes: {graph.nodes.length}</div>
                    <div>Links: {graph.links.length}</div>
                    <div>Comments: {graph.comments.length}</div>
                </div>
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                <div>
                    <button
                        onClick={history.undo}
                        disabled={history.getIndex() < 0}>
                        Undo {history.getUndoInfo()}
                    </button>
                    <button
                        onClick={history.redo}
                        disabled={
                            history.getIndex() === history.getLength() - 1 ||
                            history.getLength() === 0
                        }>
                        Redo {history.getRedoInfo()}
                    </button>
                </div>
            </div>
            <div>
                <button onClick={() => navigate('./dashboard')}>
                    Dashboard
                </button>
                <button onClick={() => navigate('./graph')}>Graph</button>
            </div>
        </>
    );
}
