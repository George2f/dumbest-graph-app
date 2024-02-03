import { useGraph } from '../../../providers/GraphProvider';
import { useHistory } from '../../../providers/HistoryProvider';
import DeleteNodeCommand from '../../../Command/DeleteNodeCommand';
import NodeListItem from './components/NodeListItem';
import { useMemo, useState } from 'react';
import TagPill from '../../../components/TagPill';
import Button from '../../../components/Button';
import { cn } from '../../../utils/cn';

export default function NodeListModule() {
    const graph = useGraph();
    const history = useHistory();
    const [filterTags, setFilterTags] = useState<number[]>([]);
    const [isFilterCross, setIsFilterCross] = useState<boolean>(false);

    const displayedNodes = useMemo(() => {
        return graph.nodes.filter((node) => {
            if (filterTags.length === 0) {
                return true;
            }

            if (isFilterCross) {
                return filterTags.every((tagId) => node.tags.includes(tagId));
            }

            return node.tags.some((tagId) => filterTags.includes(tagId));
        });
    }, [graph.nodes, filterTags, isFilterCross]);

    return (
        <>
            <div className=" ml-2 mr-2 mt-2 flex flex-row flex-wrap gap-1.5">
                {filterTags.length > 0 ? (
                    <Button
                        className={cn('px-4 py-0', {
                            ['bg-green-300']: isFilterCross,
                        })}
                        onClick={() => setIsFilterCross((prev) => !prev)}>
                        Must have all
                    </Button>
                ) : null}
                {filterTags.map((tagId) => (
                    <TagPill
                        key={tagId}
                        tag={graph.getTag(tagId)!}
                        onDelete={() => {
                            setFilterTags(
                                filterTags.filter((tag) => tag !== tagId)
                            );
                        }}
                    />
                ))}

                <select
                    className="rounded-full bg-zinc-200 px-2 py-0.5 hover:bg-zinc-200  active:bg-zinc-300"
                    onChange={(e) => {
                        setFilterTags([
                            ...filterTags,
                            Number.parseInt(e.target.value),
                        ]);
                    }}
                    value="">
                    {graph.tags
                        .filter((tag) => !filterTags.includes(tag.id))
                        .map((tag) => (
                            <option key={tag.id} value={tag.id}>
                                {tag.name}
                            </option>
                        ))}
                    <option value={''}>
                        {filterTags.length === 0 ? 'Filter' : 'Add Filter tag'}
                    </option>
                </select>
            </div>
            {filterTags.length > 0 ? (
                <div className="mx-3">{displayedNodes.length} found</div>
            ) : null}
            <ul className="grid grid-cols-1 gap-2 overflow-y-auto md:grid-cols-2 lg:grid-cols-3">
                {displayedNodes.map((node) => (
                    <li key={node.id}>
                        <NodeListItem
                            node={node}
                            graph={graph}
                            onDelete={(deletedNode) => {
                                const command = new DeleteNodeCommand(
                                    deletedNode,
                                    graph
                                );

                                command.execute();
                                history.push(command);
                            }}
                        />
                    </li>
                ))}
            </ul>
        </>
    );
}
