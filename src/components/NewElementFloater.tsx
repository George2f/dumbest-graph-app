import { useState } from 'react';
import Button from './Button';

interface INewElementFloaterProps {
    onNewNodeClick: () => void;
    onNewLinkClick: () => void;
    onNewTagClick: () => void;
}

export default function NewElementFloater({
    onNewLinkClick,
    onNewNodeClick,
    onNewTagClick,
}: INewElementFloaterProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <div className="fixed bottom-0 right-0 flex flex-col mb-4 mr-4 shadow-md">
            {isOpen ? (
                <div className="flex flex-col">
                    <Button onClick={onNewNodeClick}>Node</Button>
                    <Button onClick={onNewLinkClick}>Link</Button>
                    <Button onClick={onNewTagClick}>Tag</Button>
                </div>
            ) : null}

            <Button onClick={() => setIsOpen((v) => !v)}>
                {isOpen ? 'Close' : 'New'}
            </Button>
        </div>
    );
}
