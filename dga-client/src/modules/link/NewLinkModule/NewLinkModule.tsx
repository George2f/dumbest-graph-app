import React from 'react';
import INode from '../../../types/INode';
import LINK_TYPE_ENUM from '../../../types/LinkTypeEnum';
import AddLinkCommand from '../../../Command/AddLinkCommand';
import { useGraph } from '../../../model/GraphProvider';
import { useHistory } from '../../../model/HistoryProvider';
import Button from '../../../components/Button';

interface INewLinkModuleProps {
    node1?: INode;
}

export default function NewLinkModule({ node1 }: INewLinkModuleProps) {
    const graph = useGraph();
    const history = useHistory();

    const [newLinkName, setNewLinkName] = React.useState<string>('');
    const [newLinkType, setNewLinkType] = React.useState<LINK_TYPE_ENUM>(
        LINK_TYPE_ENUM.SIMPLE
    );
    const [newLinkNode1, setNewLinkNode1] = React.useState<INode | null>(
        node1 || null
    );
    const [newLinkNode2, setNewLinkNode2] = React.useState<INode | null>(null);

    return (
        <>
            <h3>New Link</h3>
            <h4>Choose a node</h4>
            <select
                autoFocus={!node1}
                onChange={(event) => {
                    setNewLinkNode1(
                        graph.nodes.find(
                            (node) => node.id.toString() === event.target.value
                        ) || null
                    );
                }}
                value={newLinkNode1?.id || 0}>
                <option value={0}>--</option>
                {graph.nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                        {node.name}
                    </option>
                ))}
            </select>
            <h4>And another one</h4>
            <select
                autoFocus={!!node1}
                onChange={(event) => {
                    setNewLinkNode2(
                        graph.nodes.find(
                            (node) => node.id.toString() === event.target.value
                        ) || null
                    );
                }}
                value={newLinkNode2?.id || 0}>
                <option value={0}>--</option>
                {graph.nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                        {node.name}
                    </option>
                ))}
            </select>
            <h4>How do they relate</h4>
            <select
                onChange={(event) => {
                    setNewLinkType(
                        event.target.value as unknown as LINK_TYPE_ENUM
                    );
                }}
                value={newLinkType}>
                <option value={LINK_TYPE_ENUM.SIMPLE}>Simple</option>
                <option value={LINK_TYPE_ENUM.A_TO_B}>A to B</option>
                <option value={LINK_TYPE_ENUM.BOTH_WAYS}>Both Ways</option>
            </select>
            <h4>What do you call this relationship? (e.g. "is a friend")</h4>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!newLinkNode1 || !newLinkNode2) return;

                    const command = new AddLinkCommand(
                        {
                            node1Id: newLinkNode1.id,
                            node2Id: newLinkNode2.id,
                            type: newLinkType,
                            name: newLinkName,
                        },
                        graph
                    );

                    command.execute();
                    history.push(command);

                    setNewLinkName('');
                    setNewLinkNode1(null);
                    setNewLinkNode2(null);
                    setNewLinkType(LINK_TYPE_ENUM.SIMPLE);
                }}>
                <div>
                    {newLinkNode1?.name}
                    {newLinkType === LINK_TYPE_ENUM.BOTH_WAYS ? ' <=' : ' =='}
                    <input
                        type="text"
                        value={newLinkName}
                        onChange={(event) => setNewLinkName(event.target.value)}
                    />
                    {newLinkType === LINK_TYPE_ENUM.SIMPLE ? '== ' : '=> '}

                    {newLinkNode2?.name}
                </div>
                <Button type="submit">Add Link</Button>
            </form>
        </>
    );
}
