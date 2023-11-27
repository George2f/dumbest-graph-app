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
        <main className="border-t-2 border-slate-400">
            <NewNodeModule />
            <NewLinkModule />
            <NewCommentModule />
            <NewTagModule />
            <div className="grid grid-cols-2 grid-rows-2 overflow-auto">
                <section>
                    <NodeListModule />
                </section>
                <section>
                    <LinkListModule />
                </section>
                <section>
                    <CommentListModule />
                </section>
                <section>
                    <TagListModule />
                </section>
            </div>
        </main>
    );
}
