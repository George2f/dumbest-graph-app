import { useCallback, useState } from 'react';
import { useGraph } from '../../providers/GraphProvider';
import { useHistory } from '../../providers/HistoryProvider';
import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import Input from '../Input';
import Modal from '../Modal';

export default function Header() {
    const graph = useGraph();
    const history = useHistory();
    const navigate = useNavigate();

    const [exportFileName, setExportFileName] = useState<string>('dga-data');
    const [editGraphId, setEditGraphId] = useState<string>('');
    const [isEditGraphIdModalOpen, setIsEditGraphIdModalOpen] =
        useState<boolean>(false);
    const [isManageGraphMenuOpen, setIsManageGraphMenuOpen] =
        useState<boolean>(false);

    const handleImport = useCallback(
        (e) => {
            e.preventDefault();
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'application/json';
            fileInput.onchange = (e) => {
                const files = (e.target as HTMLInputElement).files;
                if (!files || !files[0]) return;
                setExportFileName(files[0].name.split('.')[0]);
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (!e.target || !e.target.result) return;
                    const data = JSON.parse(e.target.result as string);
                    graph.initGraph(data);
                };
                reader.readAsText(files[0]);
            };
            fileInput.click();
        },
        [graph]
    );

    const handleExport = useCallback(
        (e) => {
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
        },
        [exportFileName, graph]
    );

    const handleEditGraphIdSubmit = (e) => {
        e.preventDefault();
        if (!editGraphId) return;
        graph.setGraphId(editGraphId);
        setIsEditGraphIdModalOpen(false);
    };

    return (
        <header className="shadow-md z-10">
            <div className="flex flex-row">
                <div className="w-full">
                    <div>
                        <div>
                            <h1 className="inline-block pr-4 text-3xl font-bold">
                                DGA - {graph.graphId}
                            </h1>
                        </div>
                        <div className="flex flex-col flex-wrap md:flex-row">
                            <Button
                                onClick={() =>
                                    setIsManageGraphMenuOpen((v) => !v)
                                }>
                                {isManageGraphMenuOpen
                                    ? 'Close menu'
                                    : 'Manage Graph'}
                            </Button>
                            {isManageGraphMenuOpen ? (
                                <>
                                    <Button
                                        onClick={() => {
                                            setEditGraphId(graph.graphId);
                                            setIsEditGraphIdModalOpen(true);
                                        }}>
                                        Change graph
                                    </Button>
                                    <Button onClick={handleImport}>
                                        Import
                                    </Button>
                                    <form
                                        style={{ display: 'inline' }}
                                        onSubmit={handleExport}>
                                        <Button type="submit">Export</Button>
                                        <Input
                                            value={exportFileName}
                                            onChange={(e) =>
                                                setExportFileName(
                                                    e.target.value
                                                )
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
                                </>
                            ) : null}
                        </div>
                        <div className="grid w-full grid-cols-2 md:block md:w-auto">
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

                <div className="min-w-max px-2">
                    <div>Nodes: {graph.nodes.length}</div>
                    <div>Links: {graph.links.length}</div>
                    <div>Comments: {graph.comments.length}</div>
                    <div>Tags: {graph.tags.length}</div>
                </div>
            </div>

            <div className="grid w-full grid-cols-4 md:flex md:flex-row">
                <Button onClick={() => navigate('/nodes')}>Nodes</Button>
                <Button onClick={() => navigate('/links')}>Links</Button>
                <Button onClick={() => navigate('/tags')}>Tags</Button>
                <Button onClick={() => navigate('/graph')}>Graph</Button>
            </div>
            <Modal
                isOpen={isEditGraphIdModalOpen}
                onDismiss={() => setIsEditGraphIdModalOpen(false)}>
                <form onSubmit={handleEditGraphIdSubmit}>
                    <h2>Load different graph</h2>
                    <Input
                        autoFocus
                        value={editGraphId}
                        onChange={(e) => {
                            setEditGraphId(e.target.value);
                        }}
                    />
                    <Button type="submit">Load</Button>
                </form>
            </Modal>
        </header>
    );
}
