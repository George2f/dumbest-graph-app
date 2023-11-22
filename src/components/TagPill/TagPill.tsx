import ITag from '../../types/ITag';

export default function TagPill({ tag }: { tag: ITag }) {
    return (
        <div>
            {tag.id} {tag.name}{' '}
            <span
                style={{
                    border: '1px solid grey',
                    display: 'inline-block',
                    height: '10px',
                    width: '10px',
                    backgroundColor: tag.color || 'white',
                }}></span>
        </div>
    );
}
