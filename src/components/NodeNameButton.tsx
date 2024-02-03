import { MouseEventHandler } from 'react';
import INode from '../types/INode';
import Button from './Button';

interface INodeNameButtonProps {
    node?: INode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function NodeNameButton({
    node,
    onClick,
}: INodeNameButtonProps) {
    return (
        <Button onClick={onClick}>
            <small>{node?.id}</small> {node?.name}
        </Button>
    );
}
