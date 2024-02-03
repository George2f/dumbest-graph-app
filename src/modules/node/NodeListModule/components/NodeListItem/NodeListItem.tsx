import { useMemo, useState } from 'react';
import IGraph from '../../../../../types/IGraph';
import INode from '../../../../../types/INode';
import TagPill from '../../../../../components/TagPill';
import Button from '../../../../../components/Button';
import Modal from '../../../../../components/Modal';
import NewCommentModule from '../../../../comment/NewCommentModule';
import CommentListModule from '../../../../comment/CommentListModule/CommentListModule';
import ConfirmModal from '../../../../../components/ConfirmModal';
import NodeDetailsModule from '../../../NodeDetailsModule/NodeDetailsModule';
import NewLinkModule from '../../../../link/NewLinkModule';
import LinkListModule from '../../../../link/LinkListModule';
import NewNodeModule from '../../../NewNodeModule';
import NodeNameButton from '../../../../../components/NodeNameButton';

interface INodeListItemProps {
    node: INode;
    onDelete: (node: INode) => void;
    graph: IGraph;
}

export default function NodeListItem({
    node,
    onDelete,
    graph,
}: INodeListItemProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isCommentListModalOpen, setIsCommentListModalOpen] =
        useState<boolean>(false);
    const [isNewCommentOpen, setIsNewCommentOpen] = useState<boolean>(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] =
        useState<boolean>(false);
    const [isNewLinkModalOpen, setIsNewLinkModalOpen] =
        useState<boolean>(false);
    const [isLinkListModalOpen, setIsLinkListModalOpen] =
        useState<boolean>(false);
    const [isNewNodeModalOpen, setIsNewNodeModalOpen] =
        useState<boolean>(false);

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

    return (
        <>
            <div className="my-2 rounded-xl bg-slate-200 p-2">
                <div className="rounded-lg bg-white p-1.5">
                    <div className="flex justify-between">
                        <NodeNameButton
                            node={node}
                            onClick={() => {
                                setIsEditModalOpen(true);
                            }}
                        />
                        <Button onClick={() => setIsNewNodeModalOpen(true)}>
                            Copy
                        </Button>
                    </div>
                    <Button onClick={() => setIsLinkListModalOpen(true)}>
                        Links {relatedLinks.length}
                    </Button>
                    <Button
                        onClick={() => {
                            setIsNewLinkModalOpen(true);
                        }}>
                        New Link
                    </Button>
                    <Button
                        onClick={() => {
                            setIsConfirmModalOpen(true);
                        }}>
                        Delete
                    </Button>
                    <div className="flex flex-row flex-wrap gap-1.5">
                        {node.tags.map((tagId) => (
                            <TagPill key={tagId} tag={graph.getTag(tagId)!} />
                        ))}
                    </div>
                    <div>
                        Comments:
                        {relatedComments.length ? (
                            <Button
                                onClick={() => setIsCommentListModalOpen(true)}>
                                {relatedComments.length}
                            </Button>
                        ) : null}
                        <Button onClick={() => setIsNewCommentOpen(true)}>
                            Add
                        </Button>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={isNewNodeModalOpen}
                onDismiss={() => setIsNewNodeModalOpen(false)}>
                <NewNodeModule original={node} />
            </Modal>
            <Modal
                isOpen={isEditModalOpen}
                onDismiss={() => {
                    setIsEditModalOpen(false);
                }}>
                <NodeDetailsModule
                    node={node}
                    onChange={() => setIsEditModalOpen(false)}
                />
            </Modal>
            <Modal
                isOpen={isNewLinkModalOpen}
                onDismiss={() => setIsNewLinkModalOpen(false)}>
                <NewLinkModule node1={node} />
            </Modal>
            <NewCommentModule
                isOpen={isNewCommentOpen}
                node={node}
                onClose={() => setIsNewCommentOpen(false)}
            />
            <Modal
                isOpen={isCommentListModalOpen}
                onDismiss={() => setIsCommentListModalOpen(false)}>
                <div className="max-h-96 overflow-y-scroll">
                    <CommentListModule node={node} />
                </div>
            </Modal>
            <Modal
                isOpen={isLinkListModalOpen}
                onDismiss={() => setIsLinkListModalOpen(false)}>
                <div className="max-h-96 overflow-y-scroll">
                    <LinkListModule node={node} />
                </div>
            </Modal>
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onConfirm={() => {
                    onDelete(node);
                    setIsConfirmModalOpen(false);
                }}
                onDismiss={() => setIsConfirmModalOpen(false)}>
                Are you sure you want to delete this node?
            </ConfirmModal>
        </>
    );
}
