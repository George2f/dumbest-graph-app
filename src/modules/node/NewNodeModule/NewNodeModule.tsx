import { useState } from 'react';
import { useGraph } from '../../../providers/GraphProvider';
import { useHistory } from '../../../providers/HistoryProvider';
import AddNodeCommand from '../../../Command/AddNodeCommand';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';

export default function NewNodeModule() {
    const graph = useGraph();
    const history = useHistory();

    const [newNodeName, setNewNodeName] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    return (
        <>
            <Button onClick={() => setIsModalOpen(true)}>New Node</Button>
            <Modal isOpen={isModalOpen} onDismiss={() => setIsModalOpen(false)}>
                <h3>New Node</h3>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!newNodeName) return;
                        const command = new AddNodeCommand(
                            {
                                id: graph.getNewId(),
                                name: newNodeName,
                                tags: [],
                            },
                            graph
                        );
                        command.execute();
                        history.push(command);

                        setNewNodeName('');
                    }}>
                    <label>
                        Name:
                        <input
                            type="text"
                            autoFocus
                            value={newNodeName}
                            onChange={(event) =>
                                setNewNodeName(event.target.value)
                            }
                        />
                    </label>
                    <div>
                        <Button type="submit">Add Node</Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
