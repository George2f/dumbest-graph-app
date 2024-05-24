import { useRef, useState } from 'react';
import { useGraph } from '../../../model/GraphProvider';
import { useHistory } from '../../../model/HistoryProvider';
import AddTagCommand from '../../../Command/AddTagCommand';
import Button from '../../../components/Button';

export default function NewTagModule() {
    const graph = useGraph();
    const history = useHistory();

    const [name, setName] = useState<string>('');
    const [color, setColor] = useState<string>('');
    const nameInputRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!name) return;
                    const command = new AddTagCommand(
                        {
                            name,
                            color,
                        },
                        graph
                    );

                    command.execute();
                    history.push(command);
                    setName('');
                    setColor('');
                    nameInputRef.current?.focus();
                }}>
                <h3>New Tag</h3>
                <div>
                    <label>
                        Name:
                        <input
                            autoFocus
                            ref={nameInputRef}
                            value={name}
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Color:
                        <input
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                        />
                        <input
                            type="color"
                            value={color || '#fff'}
                            onChange={(e) => setColor(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <Button type="submit">Add Tag</Button>
                </div>
            </form>
        </>
    );
}
