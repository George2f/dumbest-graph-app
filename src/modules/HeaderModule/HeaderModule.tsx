import { useState } from 'react';
import { useGraph } from '../../providers/GraphProvider';
import { useHistory } from '../../providers/HistoryProvider';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Input from '../../components/Input';

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
                tags: graph.tags,
            })
        )}`;
        const link = document.createElement('a');
        link.href = jsonString;
        link.download = `${exportFileName}.json`;

        link.click();
    };

    return (
        <>
            <div className="flex flex-row justify-between">
                <div>
                    <div>
                        <h1 className="inline-block pr-1 text-3xl font-bold">
                            DGA - Dumbest Graph App{' '}
                        </h1>
                        <Button
                            onClick={() => {
                                const fileInput =
                                    document.createElement('input');
                                fileInput.type = 'file';
                                fileInput.accept = 'application/json';
                                fileInput.onchange = (e) => {
                                    const files = (e.target as HTMLInputElement)
                                        .files;
                                    if (!files || !files[0]) return;
                                    setExportFileName(
                                        files[0].name.split('.')[0]
                                    );
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                        if (!e.target || !e.target.result)
                                            return;
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
                        </Button>
                        <form
                            style={{ display: 'inline' }}
                            onSubmit={handleExport}>
                            <Button type="submit">Export</Button>
                            <Input
                                value={exportFileName}
                                onChange={(e) =>
                                    setExportFileName(e.target.value)
                                }
                                type="text"
                            />
                        </form>
                        <Button
                            onClick={(e) => {
                                handleExport(e);
                                graph.clearGraph();
                            }}>
                            Export and clear
                        </Button>
                    </div>
                    <div className="flex flex-row">
                        <div>
                            <Button onClick={() => navigate('./dashboard')}>
                                Dashboard
                            </Button>
                            <Button onClick={() => navigate('./graph')}>
                                Graph
                            </Button>
                        </div>
                        <div className="ml-10">
                            <Button
                                onClick={history.undo}
                                disabled={history.getIndex() < 0}>
                                Undo {history.getUndoInfo()}
                            </Button>
                            <Button
                                onClick={history.redo}
                                disabled={
                                    history.getIndex() ===
                                        history.getLength() - 1 ||
                                    history.getLength() === 0
                                }>
                                Redo {history.getRedoInfo()}
                            </Button>
                        </div>
                    </div>
                </div>

                <div>
                    <div>Nodes: {graph.nodes.length}</div>
                    <div>Links: {graph.links.length}</div>
                    <div>Comments: {graph.comments.length}</div>
                    <div>Tags: {graph.tags.length}</div>
                </div>
            </div>
        </>
    );
}
