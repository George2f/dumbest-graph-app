import { useState } from 'react';
import { useGraph } from '../../../providers/GraphProvider';
import { useHistory } from '../../../providers/HistoryProvider';
import INode from '../../../types/INode';
import ILink from '../../../types/ILink';
import generateLinkName from '../../../utils/parseLinkName';
import AddCommentCommand from '../../../Command/AddCommentCommand';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';

interface INewCommentModuleProps {
    isOpen: boolean;
    onClose: () => void;
    node?: INode;
    link?: ILink;
}

export default function NewCommentModule({
    isOpen,
    onClose,
    node,
    link,
}: INewCommentModuleProps) {
    const graph = useGraph();
    const history = useHistory();

    const [newCommentText, setNewCommentText] = useState<string>('');
    const [newCommentTargetNode, setNewCommentTargetNode] =
        useState<INode | null>(node || null);
    const [newCommentTargetLink, setNewCommentTargetLink] =
        useState<ILink | null>(link || null);

    return (
        <>
            <Modal isOpen={isOpen} onDismiss={onClose}>
                <h3>New Comment</h3>
                {!node && !link ? (
                    <div>
                        <label>
                            <h4>Choose a node</h4>
                            <select
                                onChange={(event) => {
                                    console.log(event.target.value);

                                    setNewCommentTargetNode(
                                        graph.nodes.find(
                                            (node) =>
                                                node.id.toString() ===
                                                event.target.value
                                        ) || null
                                    );
                                    setNewCommentTargetLink(null);
                                }}
                                value={newCommentTargetNode?.id || 0}>
                                <option value={0}>--</option>
                                {graph.nodes.map((node) => (
                                    <option key={node.id} value={node.id}>
                                        {node.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            <h4>Or an link</h4>
                            <select
                                onChange={(event) => {
                                    setNewCommentTargetLink(
                                        graph.links.find(
                                            (link) =>
                                                link.id.toString() ===
                                                event.target.value
                                        ) || null
                                    );
                                    setNewCommentTargetNode(null);
                                }}
                                value={newCommentTargetLink?.id || 0}>
                                <option value={0}>--</option>
                                {graph.links.map((link) => (
                                    <option key={link.id} value={link.id}>
                                        {generateLinkName(link, '', '')}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                ) : null}
                {node ? <h4>Comment on: {node.name}</h4> : null}
                {link ? (
                    <h4>
                        Comment on:{' '}
                        {generateLinkName(
                            link,
                            graph.getNode(link.node1Id)?.name || '',
                            graph.getNode(link.node2Id)?.name || ''
                        )}
                    </h4>
                ) : null}
                <div>
                    <label>
                        <h4>Write a comment</h4>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (!newCommentText)
                                    return console.log('No comment');
                                if (
                                    !newCommentTargetLink &&
                                    !newCommentTargetNode
                                )
                                    return console.log('No target');

                                const command = new AddCommentCommand(
                                    {
                                        text: newCommentText,
                                        targetId:
                                            newCommentTargetLink?.id ||
                                            newCommentTargetNode?.id ||
                                            0,
                                    },
                                    graph
                                );

                                command.execute();
                                history.push(command);
                                setNewCommentText('');
                            }}>
                            <label>
                                Text:
                                <input
                                    autoFocus
                                    type="text"
                                    value={newCommentText}
                                    onChange={(event) =>
                                        setNewCommentText(event.target.value)
                                    }
                                />
                            </label>
                            <div>
                                <Button type="submit">Add Comment</Button>
                            </div>
                        </form>
                    </label>
                </div>
            </Modal>
        </>
    );
}
