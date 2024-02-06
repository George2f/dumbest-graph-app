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
    return (
        <div className="fixed bottom-0 right-0 mb-4 mr-4 flex flex-col bg-zinc-100 shadow-md">
            <Button onClick={onNewNodeClick}>New Node</Button>
            <Button onClick={onNewLinkClick}>New Link</Button>
            <Button onClick={onNewTagClick}>New Tag</Button>
        </div>
    );
}
