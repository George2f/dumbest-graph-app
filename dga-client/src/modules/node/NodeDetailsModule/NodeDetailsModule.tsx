import { useCallback, useMemo, useState } from 'react';
import INode from '../../../types/INode';
import Button from '../../../components/Button';
import TagPill from '../../../components/TagPill';
import NewCommentModule from '../../comment/NewCommentModule';
import Modal from '../../../components/Modal';
import CommentListModule from '../../comment/CommentListModule';
import { useGraph } from '../../../providers/GraphProvider';
import { useHistory } from '../../../providers/HistoryProvider';
import EditNodeCommand from '../../../Command/EditNodeCommand';
import DeleteNodeCommand from '../../../Command/DeleteNodeCommand';
import ConfirmModal from '../../../components/ConfirmModal';
import NewLinkModule from '../../link/NewLinkModule';
import LinkListModule from '../../link/LinkListModule';
import NewNodeModule from '../NewNodeModule';
import IAttribute from '../../../types/IAttribute';
import useMount from '../../../utils/useMount';

interface INodeDetailsProps {
    node: INode;
    onChange?: () => void;
}

export default function NodeDetailsModule({
    node,
    onChange,
}: INodeDetailsProps) {
    const graph = useGraph();
    const history = useHistory();

    const [editNodeTags, setEditNodeTags] = useState(node.tags || []);
    const [editNodeName, setEditNodeName] = useState(node.name);
    const [editNodeAttributes, setEditNodeAttributes] = useState<IAttribute[]>(
        []
    );
    const [isNewCommentOpen, setIsNewCommentOpen] = useState<boolean>(false);
    const [isCommentListModalOpen, setIsCommentListModalOpen] =
        useState<boolean>(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] =
        useState<boolean>(false);
    const [isNewLinkModalOpen, setIsNewLinkModalOpen] =
        useState<boolean>(false);
    const [isLinkListModalOpen, setIsLinkListModalOpen] =
        useState<boolean>(false);
    const [isNewNodeModalOpen, setIsNewNodeModalOpen] =
        useState<boolean>(false);

    useMount(() => {
        setEditNodeAttributes(
            node.attributes?.concat([
                { id: graph.getNewId(), key: '', value: '' },
            ]) || []
        );
    });

    const relatedComments = useMemo(
        () => graph.comments.filter((comment) => comment.targetId === node.id),
        [graph, node.id]
    );

    const relatedLinks = useMemo(
        () =>
            graph.links.filter(
                (link) => link.node1Id === node.id || link.node2Id === node.id
            ),
        [graph, node.id]
    );

    const handleSave = useCallback(() => {
        const command = new EditNodeCommand(
            {
                ...node,
                name: editNodeName,
                tags: editNodeTags,
                attributes: editNodeAttributes.filter((a) => a.key && a.value),
            },
            graph
        );

        command.execute();
        history.push(command);

        onChange?.();
    }, [
        editNodeAttributes,
        editNodeName,
        editNodeTags,
        graph,
        history,
        node,
        onChange,
    ]);

    return (
        <>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                }}>
                <div className="flex w-full items-center justify-between">
                    <label className="text-xl">
                        Name:
                        <input
                            type="text"
                            value={editNodeName}
                            onChange={(event) =>
                                setEditNodeName(event.target.value)
                            }
                        />
                    </label>
                    <Button
                        type="button"
                        onClick={() => setIsNewNodeModalOpen(true)}>
                        Copy
                    </Button>
                </div>
                <div>Attributes:</div>
                {editNodeAttributes.map((a, index) => (
                    <div key={index} className="">
                        <label className="flex flex-row">
                            Key:
                            <input
                                type="text"
                                className="w-full"
                                value={a.key}
                                onChange={(event) => {
                                    const isLast =
                                        index === editNodeAttributes.length - 1;

                                    const editAttributesCopy = [
                                        ...editNodeAttributes,
                                    ];
                                    editAttributesCopy[index].key =
                                        event.target.value;
                                    if (isLast) {
                                        editAttributesCopy.push({
                                            id: graph.getNewId(),
                                            key: '',
                                            value: '',
                                        });
                                    }
                                    setEditNodeAttributes(editAttributesCopy);
                                }}
                            />
                        </label>
                        <label className="flex flex-row">
                            Value:
                            <input
                                type="text"
                                className="w-full"
                                value={a.value}
                                onChange={(event) => {
                                    const newAttributes =
                                        editNodeAttributes.slice();
                                    newAttributes[index].value =
                                        event.target.value;
                                    setEditNodeAttributes(newAttributes);
                                }}
                            />
                        </label>
                        {index === editNodeAttributes.length - 1 ? null : (
                            <Button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const newAttributes =
                                        editNodeAttributes.slice();
                                    newAttributes.splice(index, 1);
                                    setEditNodeAttributes(newAttributes);
                                }}>
                                Delete
                            </Button>
                        )}
                    </div>
                ))}

                <div className="flex flex-row flex-wrap gap-1.5">
                    {editNodeTags.map((tagId) => (
                        <TagPill
                            key={tagId}
                            tag={graph.getTag(tagId)!}
                            onDelete={() => {
                                setEditNodeTags(
                                    editNodeTags.filter((tag) => tag !== tagId)
                                );
                            }}
                        />
                    ))}
                    <select
                        className="rounded-full bg-zinc-200 px-2 py-0.5 hover:bg-zinc-200  active:bg-zinc-300"
                        onChange={(e) => {
                            setEditNodeTags([
                                ...editNodeTags,
                                Number.parseInt(e.target.value),
                            ]);
                        }}
                        value="">
                        {graph.tags
                            .filter((tag) => !editNodeTags.includes(tag.id))
                            .map((tag) => (
                                <option key={tag.id} value={tag.id}>
                                    {tag.name}
                                </option>
                            ))}
                        <option value={''}>Add Tag</option>
                    </select>
                </div>
                <div>
                    Comments:
                    {relatedComments.length ? (
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                setIsCommentListModalOpen(true);
                            }}>
                            {relatedComments.length}
                        </Button>
                    ) : null}
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            setIsNewCommentOpen(true);
                        }}>
                        Add
                    </Button>
                </div>
                <div>
                    <Button type="submit">Save</Button>
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            setIsLinkListModalOpen(true);
                        }}>
                        Links {relatedLinks.length}
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            setIsNewLinkModalOpen(true);
                        }}>
                        New Link
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            setIsConfirmModalOpen(true);
                        }}>
                        Delete
                    </Button>
                </div>
            </form>
            <Modal
                isOpen={isNewNodeModalOpen}
                onDismiss={() => setIsNewNodeModalOpen(false)}>
                <NewNodeModule original={node} />
            </Modal>
            <Modal
                isOpen={isLinkListModalOpen}
                onDismiss={() => setIsLinkListModalOpen(false)}>
                <div className="max-h-96 overflow-y-scroll">
                    <LinkListModule node={node} />
                </div>
            </Modal>
            <Modal
                isOpen={isNewLinkModalOpen}
                onDismiss={() => setIsNewLinkModalOpen(false)}>
                <NewLinkModule node1={node} />
            </Modal>
            <Modal
                isOpen={isCommentListModalOpen}
                onDismiss={() => setIsCommentListModalOpen(false)}>
                <CommentListModule node={node} />
            </Modal>
            <NewCommentModule
                isOpen={isNewCommentOpen}
                node={node}
                onClose={() => setIsNewCommentOpen(false)}
            />
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onConfirm={() => {
                    const command = new DeleteNodeCommand(node, graph);

                    command.execute();
                    history.push(command);
                    setIsConfirmModalOpen(false);
                    onChange?.();
                }}
                onDismiss={() => setIsConfirmModalOpen(false)}>
                Are you sure you want to delete this node?
            </ConfirmModal>
        </>
    );
}
