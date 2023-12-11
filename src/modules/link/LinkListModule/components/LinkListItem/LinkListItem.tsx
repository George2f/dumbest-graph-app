import { useState } from 'react';
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

interface ILinkListItemProps {
    link: ILink;
    onDelete: () => void;
    onChange: (link: ILink) => void;
    nodes: INode[];
    graph: IGraph;
}

export default function LinkListItem({
    link,
    onDelete,
    onChange,
    nodes,
    graph,
}: ILinkListItemProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCommentListModalOpen, setIsCommentListModalOpen] =
        useState<boolean>(false);
    const [isNewCommentOpen, setIsNewCommentOpen] = useState<boolean>(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] =
        useState<boolean>(false);

    const relatedComments = graph.comments.filter(
        (comment) => comment.targetId === link.id
    );

    return (
        <>
            <Modal isOpen={isModalOpen} onDismiss={() => setIsModalOpen(false)}>
                <EditLink
                    link={link}
                    onChange={(link) => {
                        onChange(link);
                        setIsModalOpen(false);
                    }}
                    onDelete={() => setIsConfirmModalOpen(true)}
                    nodes={nodes}
                    active={isModalOpen}
                />
            </Modal>
            <div className="my-2 rounded-l-xl bg-slate-200 p-2 pr-0">
                <div className="rounded-l-lg bg-white p-1.5">
                    <div>
                        <Button
                            onClick={() => {
                                setIsModalOpen(true);
                            }}>
                            {link.id}{' '}
                            {generateLinkName(
                                link,
                                nodes.find((n) => n.id === link.node1Id)
                                    ?.name || '',
                                nodes.find((n) => n.id === link.node2Id)
                                    ?.name || ''
                            )}
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
