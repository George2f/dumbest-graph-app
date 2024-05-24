import { useMemo } from 'react';
import DeleteLinkCommand from '../../../Command/DeleteLinkCommand';
import EditLinkCommand from '../../../Command/EditLinkCommand';
import { useGraph } from '../../../model/GraphProvider';
import { useHistory } from '../../../model/HistoryProvider';
import INode from '../../../types/INode';
import LinkListItem from './components/LinkListItem';

interface ILinkListModuleProps {
    node?: INode;
}

export default function LinkListModule({ node }: ILinkListModuleProps) {
    const graph = useGraph();
    const history = useHistory();

    const displayedLinks = useMemo(
        () =>
            graph.links.filter((link) =>
                node
                    ? link.node1Id === node.id || link.node2Id === node.id
                    : true
            ),
        [graph, node]
    );

    return (
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
            {displayedLinks.map((link) => (
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
                    />
                </li>
            ))}
        </ul>
    );
}
