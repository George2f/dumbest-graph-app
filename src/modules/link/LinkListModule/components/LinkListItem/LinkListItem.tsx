import { useState } from 'react';
import ILink from '../../../../../types/ILink';
import generateLinkName from '../../../../../utils/parseLinkName';
import INode from '../../../../../types/INode';
import EditLink from '../EditLink';
import Button from '../../../../../components/Button';
import Modal from '../../../../../components/Modal';

interface ILinkListItemProps {
    link: ILink;
    onDelete: () => void;
    onChange: (link: ILink) => void;
    nodes: INode[];
}

export default function LinkListItem({
    link,
    onDelete,
    onChange,
    nodes,
}: ILinkListItemProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <>
            <Modal isOpen={isModalOpen} onDismiss={() => setIsModalOpen(false)}>
                <EditLink
                    link={link}
                    onChange={(link) => {
                        onChange(link);
                        setIsModalOpen(false);
                    }}
                    onDelete={onDelete}
                    nodes={nodes}
                    active={isModalOpen}
                />
            </Modal>
            <>
                <Button
                    onClick={() => {
                        setIsModalOpen(true);
                    }}>
                    {link.id}{' '}
                    {generateLinkName(
                        link,
                        nodes.find((n) => n.id === link.node1Id)?.name || '',
                        nodes.find((n) => n.id === link.node2Id)?.name || ''
                    )}
                </Button>
            </>
            <Button onClick={onDelete}>Delete</Button>
        </>
    );
}
