import NewLinkModule from '../../modules/link/NewLinkModule';
import LinkListModule from '../../modules/link/LinkListModule';
import NewNodeModule from '../../modules/node/NewNodeModule';
import NodeListModule from '../../modules/node/NodeListModule';
import NewCommentModule from '../../modules/comment/NewCommentModule';
import CommentListModule from '../../modules/comment/CommentListModule';
import NewTagModule from '../../modules/tag/NewTagModule';
import TagListModule from '../../modules/tag/TagListModule';

export default function Dashboard() {
    return (
        <main
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '1fr 1fr',
                overflow: 'auto',
                borderBottom: '1px solid grey',
                borderTop: '1px solid grey',
            }}>
            <section>
                <h2>Nodes</h2>
                <NewNodeModule />
                <NodeListModule />
            </section>
            <section>
                <h2>Links</h2>
                <NewLinkModule />
                <LinkListModule />
            </section>
            <section>
                <h2>Comments</h2>
                <NewCommentModule />
                <CommentListModule />
            </section>
            <section>
                <h2>Tags</h2>
                <NewTagModule />
                <TagListModule />
            </section>
        </main>
    );
}
