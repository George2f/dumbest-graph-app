import { useCallback } from 'react';
import GraphPersistenceContext from '../GraphPersistenceContext';
import INode, { NewNode } from '../../types/INode';
import ILink, { NewLink } from '../../types/ILink';
import IComment, { NewComment } from '../../types/IComment';
import ITag, { NewTag } from '../../types/ITag';
import IProviderProps from '../../providers/types/IProviderProps';
import IdType from '../../types/IdType';

export default function LocalStoragePersistenceProvider({
    children,
}: IProviderProps) {
    const getGraph = (
        id: IdType
    ):
        | {
              nodes: (INode & { deleted?: boolean })[];
              links: (ILink & { deleted?: boolean })[];
              comments: (IComment & { deleted?: boolean })[];
              tags: (ITag & { deleted?: boolean })[];
              nextId: number;
              id: IdType;
              name: string;
          }
        | undefined => {
        const graph = localStorage.getItem(id + '');
        if (!graph) return undefined;
        return JSON.parse(graph || '{}');
    };

    const handleLoadGraph = useCallback(({ name }: { name: string }) => {
        console.debug('Loading graph');
        const graphs = JSON.parse(localStorage.getItem('graphs') || '{}');
        const graphId = parseInt(
            Object.entries(graphs).find(
                ([, graphName]) => graphName === name
            )?.[0] || ''
        );

        if (graphId) {
            const graph = getGraph(graphId);
            if (!graph) throw new Error('Graph not found');
            const { nodes, links, comments, tags, nextId } = graph;
            return {
                id: graphId,
                name,
                nextId,
                nodes: nodes.filter((n) => !n.deleted) || [],
                links: links.filter((l) => !l.deleted) || [],
                comments: comments.filter((c) => !c.deleted) || [],
                tags: tags.filter((t) => !t.deleted) || [],
            };
        } else {
            const id = Object.keys(graphs).length + 1;
            const newGraph = {
                id,
                name,
                nextId: 1,
                nodes: [],
                links: [],
                comments: [],
                tags: [],
            };
            localStorage.setItem(id + '', JSON.stringify(newGraph));
            graphs[id] = name;
            localStorage.setItem('graphs', JSON.stringify(graphs));
            return newGraph;
        }
    }, []);

    const handleClearGraph = useCallback(({ id }: { id: IdType }) => {
        console.debug('Clearing graph');
        const graph = getGraph(id);

        localStorage.setItem(
            id + '',
            JSON.stringify({
                ...graph,
                nodes: [],
                links: [],
                comments: [],
                tags: [],
                nextId: 1,
            })
        );
    }, []);

    const handleCreateNode = ({
        graphId,
        node,
    }: {
        graphId: number;
        node: NewNode | INode;
    }): INode => {
        console.debug('Creating node');
        const graph = getGraph(graphId);
        if (!graph) throw new Error('Graph not found');
        if ('id' in node) {
            const oldIndex = graph.nodes.findIndex(({ id }) => id === node.id);
            graph.nodes[oldIndex] = node;
            delete graph.nodes[oldIndex].deleted;

            graph.links = graph.links.map((l) => {
                if (l.node1Id === node.id || l.node2Id === node.id) {
                    l.deleted = false;
                }
                return l;
            });

            graph.comments = graph.comments.map((c) => {
                if (c.targetId === node.id) {
                    c.deleted = false;
                }
                return c;
            });

            localStorage.setItem(graphId + '', JSON.stringify(graph));

            return node;
        } else {
            const newNode = { ...node, id: graph.nextId };
            graph.nextId++;
            graph.nodes.push(newNode);
            localStorage.setItem(graphId + '', JSON.stringify(graph));
            return newNode;
        }
    };

    const handleCreateLink = ({
        graphId,
        link,
    }: {
        graphId: number;
        link: NewLink | ILink;
    }): ILink => {
        console.debug('Creating link');
        const graph = getGraph(graphId);
        if (!graph) throw new Error('Graph not found');

        if ('id' in link) {
            const oldIndex = graph.links.findIndex(({ id }) => id === link.id);
            graph.links[oldIndex] = link;
            delete graph.links[oldIndex].deleted;

            graph.comments = graph.comments.map((c) => {
                if (c.targetId === link.id) {
                    c.deleted = false;
                }
                return c;
            });

            localStorage.setItem(graphId + '', JSON.stringify(graph));

            return link;
        } else {
            const newLink = { ...link, id: graph.nextId };
            graph.nextId++;
            graph.links.push(newLink);
            localStorage.setItem(graphId + '', JSON.stringify(graph));
            return newLink;
        }
    };

    const handleCreateComment = ({
        graphId,
        comment,
    }: {
        graphId: IdType;
        comment: NewComment | IComment;
    }): IComment => {
        console.debug('Creating comment');
        const graph = getGraph(graphId);
        if (!graph) throw new Error('Graph not found');

        if ('id' in comment) {
            const oldIndex = graph.comments.findIndex(
                ({ id }) => id === comment.id
            );
            graph.comments[oldIndex] = comment;
            delete graph.comments[oldIndex].deleted;

            localStorage.setItem(graphId + '', JSON.stringify(graph));

            return comment;
        } else {
            const newComment = { ...comment, id: graph.nextId };
            graph.nextId++;
            graph.comments.push(newComment);
            localStorage.setItem(graphId + '', JSON.stringify(graph));
            return newComment;
        }
    };

    const handleCreateTag = ({
        graphId,
        tag,
    }: {
        graphId: IdType;
        tag: NewTag | ITag;
    }): ITag => {
        console.debug('Creating tag');
        const graph = getGraph(graphId);
        if (!graph) throw new Error('Graph not found');

        if ('id' in tag) {
            const oldIndex = graph.tags.findIndex(({ id }) => id === tag.id);
            graph.tags[oldIndex] = tag;
            delete graph.tags[oldIndex].deleted;

            localStorage.setItem(graphId + '', JSON.stringify(graph));

            return tag;
        } else {
            const newTag = { ...tag, id: graph.nextId };
            graph.nextId++;
            graph.tags.push(newTag);
            localStorage.setItem(graphId + '', JSON.stringify(graph));
            return newTag;
        }
    };

    const handleUpdateNode = ({
        graphId,
        node,
    }: {
        graphId: IdType;
        node: INode;
    }): INode => {
        console.debug('Updating node');
        const graph = getGraph(graphId);
        if (!graph) throw new Error('Graph not found');

        const index = graph.nodes.findIndex(({ id }) => id === node.id);
        graph.nodes[index] = node;
        localStorage.setItem(graphId + '', JSON.stringify(graph));
        return node;
    };

    const handleUpdateLink = ({
        graphId,
        link,
    }: {
        graphId: IdType;
        link: ILink;
    }): ILink => {
        console.debug('Updating link');
        const graph = getGraph(graphId);
        if (!graph) throw new Error('Graph not found');

        const index = graph.links.findIndex(({ id }) => id === link.id);
        graph.links[index] = link;
        localStorage.setItem(graphId + '', JSON.stringify(graph));
        return link;
    };

    const handleUpdateComment = ({
        graphId,
        comment,
    }: {
        graphId: IdType;
        comment: IComment;
    }): IComment => {
        console.debug('Updating comment');
        const graph = getGraph(graphId);
        if (!graph) throw new Error('Graph not found');

        const index = graph.comments.findIndex(({ id }) => id === comment.id);
        graph.comments[index] = comment;
        localStorage.setItem(graphId + '', JSON.stringify(graph));
        return comment;
    };

    const handleUpdateTag = ({
        graphId,
        tag,
    }: {
        graphId: IdType;
        tag: ITag;
    }): ITag => {
        console.debug('Updating tag');
        const graph = getGraph(graphId);
        if (!graph) throw new Error('Graph not found');

        const index = graph.tags.findIndex(({ id }) => id === tag.id);
        graph.tags[index] = tag;
        localStorage.setItem(graphId + '', JSON.stringify(graph));
        return tag;
    };

    const handleDeleteNode = ({
        graphId,
        nodeId,
    }: {
        graphId: IdType;
        nodeId: IdType;
    }): INode => {
        console.debug('Deleting node');
        const graph = getGraph(graphId);
        if (!graph) throw new Error('Graph not found');

        const index = graph.nodes.findIndex(({ id }) => id === nodeId);

        const newLinks = graph.links.map((l) => {
            if (l.node1Id === nodeId || l.node2Id === nodeId) {
                l.deleted = true;
            }
            return l;
        });

        const deletedLinks = graph.links.filter(
            ({ node1Id, node2Id }) => node1Id === nodeId || node2Id === nodeId
        );
        const newComments = graph.comments.map((c) => {
            if (c.targetId === nodeId) {
                c.deleted = true;
            }
            if (deletedLinks.find(({ id }) => id === c.targetId)) {
                c.deleted = true;
            }
            return c;
        });

        graph.nodes[index].deleted = true;

        localStorage.setItem(
            graphId + '',
            JSON.stringify({
                ...graph,
                links: newLinks,
                comments: newComments,
            })
        );
        return graph.nodes[index];
    };

    const handleDeleteLink = ({
        graphId,
        linkId,
    }: {
        graphId: IdType;
        linkId: IdType;
    }): ILink => {
        console.debug('Deleting link');
        const graph = getGraph(graphId);
        if (!graph) throw new Error('Graph not found');

        const index = graph.links.findIndex(({ id }) => id === linkId);
        const newComments = graph.comments.map((c) => {
            if (c.targetId === linkId) {
                c.deleted = true;
            }
            return c;
        });

        graph.links[index].deleted = true;

        localStorage.setItem(
            graphId + '',
            JSON.stringify({ ...graph, comments: newComments })
        );

        return graph.links[index];
    };

    const handleDeleteComment = ({
        graphId,
        commentId,
    }: {
        graphId: IdType;
        commentId: IdType;
    }): IComment => {
        console.debug('Deleting comment');
        const graph = getGraph(graphId);
        if (!graph) throw new Error('Graph not found');

        const index = graph.comments.findIndex(({ id }) => id === commentId);

        graph.comments[index].deleted = true;

        localStorage.setItem(graphId + '', JSON.stringify(graph));
        return graph.comments[index];
    };

    const handleDeleteTag = ({
        graphId,
        tagId,
    }: {
        graphId: IdType;
        tagId: IdType;
    }): ITag => {
        console.debug('Deleting tag');
        const graph = getGraph(graphId);
        if (!graph) throw new Error('Graph not found');

        const index = graph.tags.findIndex(({ id }) => id === tagId);

        const newNodes = graph.nodes.map((node) => ({
            ...node,
            tags: node.tags.filter((tag) => tag !== tagId),
        }));

        graph.tags[index].deleted = true;
        localStorage.setItem(
            graphId + '',
            JSON.stringify({ ...graph, nodes: newNodes })
        );
        return graph.tags[index];
    };

    return (
        <GraphPersistenceContext.Provider
            value={{
                clearGraph: handleClearGraph,
                loadGraph: handleLoadGraph,
                createComment: handleCreateComment,
                createLink: handleCreateLink,
                createNode: handleCreateNode,
                createTag: handleCreateTag,
                deleteComment: handleDeleteComment,
                deleteLink: handleDeleteLink,
                deleteNode: handleDeleteNode,
                deleteTag: handleDeleteTag,
                updateComment: handleUpdateComment,
                updateLink: handleUpdateLink,
                updateNode: handleUpdateNode,
                updateTag: handleUpdateTag,
            }}>
            {children}
        </GraphPersistenceContext.Provider>
    );
}
