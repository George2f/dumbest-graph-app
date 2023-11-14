import GraphModule from '../../modules/GraphModule';

export default function Graph() {
    return (
        <main
            style={{
                borderTop: '1px solid grey',
                borderBottom: '1px solid grey',
                backgroundColor: 'lightblue',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <GraphModule />
        </main>
    );
}
