import DeleteLinkCommand from '../../../Command/DeleteLinkCommand';
import EditLinkCommand from '../../../Command/EditLinkCommand';
import { useGraph } from '../../../providers/GraphProvider';
import { useHistory } from '../../../providers/HistoryProvider';
import LinkListItem from './components/LinkListItem';

export default function LinkListModule() {
    const graph = useGraph();
    const history = useHistory();
    return (
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
            {graph.links.map((link) => (
                <li key={link.id}>
                    <LinkListItem
                        link={link}
                        graph={graph}
                        onDelete={() => {
                            const command = new DeleteLinkCommand(link, graph);

                            command.execute();
                            history.push(command);
                        }}
                        onChange={(link) => {
                            const command = new EditLinkCommand(link, graph);

                            command.execute();
                            history.push(command);
                        }}
                        nodes={graph.nodes}
                    />
                </li>
            ))}
        </ul>
    );
}
