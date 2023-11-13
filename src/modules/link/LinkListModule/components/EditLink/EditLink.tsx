import { useState } from 'react';
import LINK_TYPE_ENUM from '../../../../../types/LinkTypeEnum';
import ILink from '../../../../../types/ILink';
import INode from '../../../../../types/INode';

interface IEditLinkModuleProps {
    link: ILink;
    onChange: (link: ILink) => void;
    nodes: INode[];
    active: boolean;
}

export default function EditLinkModule({
    link,
    onChange,
    nodes,
}: IEditLinkModuleProps) {
    const [editLinkName, setEditLinkName] = useState(link.name);
    const [editLinkType, setEditLinkType] = useState(link.type);

    const [editNode1Id, setEditNode1Id] = useState<string | null>(
        link.node1Id.toString()
    );
    const [editNode2Id, setEditNode2Id] = useState<string | null>(
        link.node2Id.toString()
    );

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (!link || !editNode1Id || !editNode2Id) return;
                onChange({
                    ...link,
                    node1Id: Number(editNode1Id),
                    node2Id: Number(editNode2Id),
                    name: editLinkName,
                    type: editLinkType,
                });
                setEditNode1Id(null);
                setEditNode2Id(null);

                setEditLinkName('');
                setEditLinkType(LINK_TYPE_ENUM.SIMPLE);
            }}>
            <div>
                <select
                    onChange={(event) => {
                        setEditNode1Id(event.target.value || null);
                    }}
                    value={editNode1Id || 0}>
                    <option value={0}>--</option>
                    {nodes.map((node) => (
                        <option key={node.id} value={node.id}>
                            {node.name}
                        </option>
                    ))}
                </select>
                {editLinkType === LINK_TYPE_ENUM.BOTH_WAYS ? ' <=' : ' =='}
                <input
                    type="text"
                    value={editLinkName}
                    onChange={(event) => setEditLinkName(event.target.value)}
                />
                {editLinkType === LINK_TYPE_ENUM.A_TO_B ||
                editLinkType === LINK_TYPE_ENUM.BOTH_WAYS
                    ? '=> '
                    : '== '}
                <select
                    onChange={(event) => {
                        setEditNode2Id(event.target.value || null);
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
                <option value={LINK_TYPE_ENUM.BOTH_WAYS}>Both Ways</option>
            </select>
            <button type="submit">Done</button>
        </form>
    );
}
