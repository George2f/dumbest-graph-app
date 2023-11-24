import ITag from '../types/ITag';
import ColorSquare from './ColorSquare';

export default function TagPill({
    tag,
    onDelete,
    onEdit,
}: {
    tag: ITag;
    onDelete?: () => void;
    onEdit?: () => void;
}) {
    return (
        <div className="flex h-8 flex-row items-center gap-1 rounded-full bg-slate-200 px-2 py-0.5 hover:bg-slate-100 active:bg-slate-300">
            <button onClick={onEdit}>
                <span className="text-xs">{tag.id}</span>{' '}
                <span className="text-sm">{tag.name}</span>{' '}
                <ColorSquare color={tag.color} />
            </button>
            {onDelete ? (
                <button
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-600 p-1 text-xs leading-none text-white"
                    onClick={onDelete}>
                    x
                </button>
            ) : null}
            {onEdit ? (
                <button
                    className="line-height-0 flex h-5 w-5 flex-col items-center justify-center gap-0.5 rounded-full bg-slate-600 p-1 text-xs text-white"
                    onClick={onEdit}>
                    <span className="h-0.5 w-1.5 bg-white"></span>
                    <span className="h-0.5 w-1.5 bg-white"></span>
                    <span className="h-0.5 w-1.5 bg-white"></span>
                </button>
            ) : null}
        </div>
    );
}
