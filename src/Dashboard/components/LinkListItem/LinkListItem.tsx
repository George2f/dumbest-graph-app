import { useState } from 'react';
import ILink from '../../../types/ILink';
import LINK_TYPE_ENUM from '../../../types/LinkTypeEnum';
import parseLinkName from '../../../utils/parseLinkName';
import INode from '../../../types/INode';

interface ILinkListItemProps {
    link: ILink;
    active: boolean;
    onClick: () => void;
    onDelete: () => void;
    onChange: (id: number, link: ILink) => void;
    nodes: INode[];
}

export default function LinkListItem({
    link,
    active,
    onClick,
    onDelete,
    onChange,
    nodes,
}: ILinkListItemProps) {
    const [editLinkName, setEditLinkName] = useState('');
    const [editLinkType, setEditLinkType] = useState(LINK_TYPE_ENUM.SIMPLE);

    const [editNode1Id, setEditNode1Id] = useState<string | null>(null);
    const [editNode2Id, setEditNode2Id] = useState<string | null>(null);
    const [editNode1Name, setEditNode1Name] = useState<string | null>(null);
    const [editNode2Name, setEditNode2Name] = useState<string | null>(null);

    return (
        <li key={link.id}>
            {active ? (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (
                            !link ||
                            !editNode1Id ||
                            !editNode2Id ||
                            !editNode1Name ||
                            !editNode2Name
                        )
                            return;
                        onChange(link.id, {
                            ...link,
                            node1Id: Number(editNode1Id),
                            node2Id: Number(editNode2Id),
                            node1Name: editNode1Name,
                            node2Name: editNode2Name,
                            name: editLinkName,
                            type: editLinkType,
                        });
                        setEditNode1Id(null);
                        setEditNode2Id(null);
                        setEditNode1Name(null);
                        setEditNode2Name(null);
                        setEditLinkName('');
                        setEditLinkType(LINK_TYPE_ENUM.SIMPLE);
                    }}>
                    <div>
                        <select
                            onChange={(event) => {
                                setEditNode1Id(event.target.value || null);
                                setEditNode1Name(
                                    nodes.find(
                                        (node) =>
                                            node.id ===
                                            Number(event.target.value)
                                    )?.name || null
                                );
                            }}
                            value={editNode1Id || 0}>
                            <option value={0}>--</option>
                            {nodes.map((node) => (
                                <option key={node.id} value={node.id}>
                                    {node.name}
                                </option>
                            ))}
                        </select>
                        {editLinkType === LINK_TYPE_ENUM.BOTH_WAYS
                            ? ' <='
                            : ' =='}
                        <input
                            type="text"
                            value={editLinkName}
                            onChange={(event) =>
                                setEditLinkName(event.target.value)
                            }
                        />
                        {editLinkType === LINK_TYPE_ENUM.A_TO_B ||
                        editLinkType === LINK_TYPE_ENUM.BOTH_WAYS
                            ? '=> '
                            : '== '}
                        <select
                            onChange={(event) => {
                                setEditNode2Id(event.target.value || null);
                                setEditNode2Name(
                                    nodes.find(
                                        (node) =>
                                            node.id ===
                                            Number(event.target.value)
                                    )?.name || null
                                );
                            }}
                            value={editNode2Id || 0}>
                            <option value={0}>--</option>
                            {nodes.map((node) => (
                                <option key={node.id} value={node.id}>
                                    {node.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <select
                        onChange={(event) => {
                            setEditLinkType(
                                event.target.value as unknown as LINK_TYPE_ENUM
                            );
                        }}
                        value={editLinkType}>
                        <option value={LINK_TYPE_ENUM.SIMPLE}>Simple</option>
                        <option value={LINK_TYPE_ENUM.A_TO_B}>A to B</option>
                        <option value={LINK_TYPE_ENUM.BOTH_WAYS}>
                            Both Ways
                        </option>
                    </select>
                    <button type="submit">Done</button>
                </form>
            ) : (
                <>
                    {link.id}{' '}
                    <button
                        onClick={() => {
                            onClick();
                            setEditLinkName(link.name);
                            setEditLinkType(link.type);
                            setEditNode1Id(link.node1Id.toString());
                            setEditNode2Id(link.node2Id.toString());
                            setEditNode1Name(link.node1Name);
                            setEditNode2Name(link.node2Name);
                        }}>
                        {parseLinkName(link)}
                    </button>
                </>
            )}
            <button onClick={onDelete}>Delete</button>
        </li>
    );
}
