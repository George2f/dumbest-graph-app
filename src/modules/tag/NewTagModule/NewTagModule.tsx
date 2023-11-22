import { useState } from 'react';
import { useGraph } from '../../../providers/GraphProvider';
import { useHistory } from '../../../providers/HistoryProvider';
import AddTagCommand from '../../../Command/AddTagCommand';

export default function NewTagModule() {
    const graph = useGraph();
    const history = useHistory();

    const [name, setName] = useState('');
    const [color, setColor] = useState('');

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                const command = new AddTagCommand(
                    {
                        id: graph.getNewId(),
                        name,
                        color,
                    },
                    graph
                );

                command.execute();
                history.push(command);
                setName('');
                setColor('');
            }}>
            <h3>New Tag</h3>
            <div>
                <label>
                    <h4>Tag Name</h4>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    <h4>Tag Color</h4>
                    <input
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                    />
                </label>
            </div>
            <button type="submit">Add Tag</button>
        </form>
    );
}
