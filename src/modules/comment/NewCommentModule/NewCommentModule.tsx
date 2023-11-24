import { useState } from 'react';
import { useGraph } from '../../../providers/GraphProvider';
import { useHistory } from '../../../providers/HistoryProvider';
import INode from '../../../types/INode';
import ILink from '../../../types/ILink';
import generateLinkName from '../../../utils/parseLinkName';
import AddCommentCommand from '../../../Command/AddCommentCommand';
import Button from '../../../components/Button';

export default function NewCommentModule() {
    const graph = useGraph();
    const history = useHistory();

    const [newCommentText, setNewCommentText] = useState<string>('');
    const [newCommentTargetNode, setNewCommentTargetNode] =
        useState<INode | null>(null);
    const [newCommentTargetLink, setNewCommentTargetLink] =
        useState<ILink | null>(null);

    return (
        <>
            <h3>New Comment</h3>
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
            </div>
            <div>
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
            <div>
                <label>
                    <h4>Write a comment</h4>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (!newCommentText)
                                return console.log('No comment');
                            if (!newCommentTargetLink && !newCommentTargetNode)
                                return console.log('No target');

                            const command = new AddCommentCommand(
                                {
                                    id: graph.getNewId(),
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
                                type="text"
                                value={newCommentText}
                                onChange={(event) =>
                                    setNewCommentText(event.target.value)
                                }
                            />
                            <Button type="submit">Save Comment</Button>
                        </label>
                    </form>
                </label>
            </div>
        </>
    );
}
