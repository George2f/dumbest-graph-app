import DeleteTagCommand from '../../../Command/DeleteTagCommand';
import EditTagCommand from '../../../Command/EditTagCommand';
import { useGraph } from '../../../providers/GraphProvider';
import { useHistory } from '../../../providers/HistoryProvider';
import TagListItem from './components/TagListItem';

export default function TagListModule() {
    const graph = useGraph();
    const history = useHistory();

    return (
        <>
            <h3>Tags</h3>
            <ul>
                {graph.tags.map((tag) => (
                    <TagListItem
                        key={tag.id}
                        tag={tag}
                        onChange={(changedTag) => {
                            const command = new EditTagCommand(
                                tag.id,
                                changedTag,
                                graph
                            );

                            command.execute();
                            history.push(command);
                        }}
                        onDelete={(deletedTag) => {
                            const command = new DeleteTagCommand(
                                deletedTag,
                                graph
                            );

                            command.execute();
                            history.push(command);
                        }}
                    />
                ))}
            </ul>
        </>
    );
}
