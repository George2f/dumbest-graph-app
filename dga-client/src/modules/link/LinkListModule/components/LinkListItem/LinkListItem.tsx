import { useMemo, useState } from 'react';
import ILink from '../../../../../types/ILink';
import generateLinkName from '../../../../../utils/parseLinkName';
import INode from '../../../../../types/INode';
import EditLink from '../EditLink';
import Button from '../../../../../components/Button';
import Modal from '../../../../../components/Modal';
import IGraph from '../../../../../types/IGraph';
import NewCommentModule from '../../../../comment/NewCommentModule';
import CommentListModule from '../../../../comment/CommentListModule';
import ConfirmModal from '../../../../../components/ConfirmModal';
import NodeDetailsModule from '../../../../node/NodeDetailsModule';

interface ILinkListItemProps {
    link: ILink;
    onDelete: () => void;
    onChange: (link: ILink) => void;
    graph: IGraph;
}

export default function LinkListItem({
    link,
    onDelete,
    onChange,
    graph,
}: ILinkListItemProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCommentListModalOpen, setIsCommentListModalOpen] =
        useState<boolean>(false);
    const [isNewCommentOpen, setIsNewCommentOpen] = useState<boolean>(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] =
        useState<boolean>(false);
    const [isNodeDetailsModalOpen, setIsNodeDetailsModalOpen] =
        useState<boolean>(false);
    const [selectedNode, setSelectedNode] = useState<INode | undefined>();

    const relatedComments = graph.comments.filter(
        (comment) => comment.targetId === link.id
    );

    const node1 = useMemo(
        () => graph.nodes.find((n) => n.id === link.node1Id),
        [graph, link.node1Id]
    );

    const node2 = useMemo(
        () => graph.nodes.find((n) => n.id === link.node2Id),
        [graph, link.node2Id]
    );

    return (
        <>
            <div className="my-2 rounded-xl bg-slate-200 p-2">
                <div className="rounded-lg bg-white p-1.5">
                    <div>
                        <Button
                            onClick={() => {
                                setIsModalOpen(true);
                            }}>
                            {generateLinkName(
                                link,
                                node1?.name || '',
                                node2?.name || ''
                            )}
                        </Button>
                    </div>
                    <div>
                        <Button
                            onClick={() => {
                                setSelectedNode(node1);
                                setIsNodeDetailsModalOpen(true);
                            }}>
                            {node1?.name}
                        </Button>
                        <Button
                            onClick={() => {
                                setSelectedNode(node2);
                                setIsNodeDetailsModalOpen(true);
                            }}>
                            {node2?.name}
                        </Button>
                        <Button onClick={() => setIsConfirmModalOpen(true)}>
                            Delete
                        </Button>
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
            <Modal isOpen={isModalOpen} onDismiss={() => setIsModalOpen(false)}>
                <EditLink
                    link={link}
                    onChange={(link) => {
                        onChange(link);
                        setIsModalOpen(false);
                    }}
                    onDelete={() => setIsConfirmModalOpen(true)}
                    nodes={graph.nodes}
                    active={isModalOpen}
                />
            </Modal>
            <Modal
                isOpen={isNodeDetailsModalOpen}
                onDismiss={() => setIsNodeDetailsModalOpen(false)}>
                {selectedNode ? (
                    <NodeDetailsModule
                        node={selectedNode}
                        onChange={() => setIsNodeDetailsModalOpen(false)}
                    />
                ) : null}
            </Modal>
            <NewCommentModule
                isOpen={isNewCommentOpen}
                link={link}
                onClose={() => setIsNewCommentOpen(false)}
            />
            <Modal
                isOpen={isCommentListModalOpen}
                onDismiss={() => setIsCommentListModalOpen(false)}>
                <CommentListModule link={link} />
            </Modal>
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onConfirm={onDelete}
                onDismiss={() => setIsConfirmModalOpen(false)}>
                <div>Are you sure you want to delete this link?</div>
            </ConfirmModal>
        </>
    );
}
