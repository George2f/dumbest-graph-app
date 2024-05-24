import GraphPersistenceContext from '../GraphPersistenceContext';
import IComment, { NewComment } from '../../types/IComment';
import ILink, { NewLink } from '../../types/ILink';
import INode, { NewNode } from '../../types/INode';
import ITag, { NewTag } from '../../types/ITag';
import IProviderProps from '../../types/IProviderProps';
import sqliteDataMapper from './sqliteDataMapper';
import IdType from '../../types/IdType';
import LINK_TYPE_ENUM from '../../types/LinkTypeEnum';

export default function SqlitePersistenceProvider({
    children,
}: IProviderProps) {
    const handleClearGraph = async ({ id }: { id: IdType }): Promise<void> => {
        sqliteDataMapper.$transaction([
            sqliteDataMapper.node.updateMany({
                where: {
                    graphId: id,
                },
                data: {
                    deletedAt: new Date(),
                },
            }),
            sqliteDataMapper.link.updateMany({
                where: {
                    graphId: id,
                },
                data: {
                    deletedAt: new Date(),
                },
            }),
            sqliteDataMapper.comment.updateMany({
                where: {
                    graphId: id,
                },
                data: {
                    deletedAt: new Date(),
                },
            }),
            sqliteDataMapper.tag.updateMany({
                where: {
                    graphId: id,
                },
                data: {
                    deletedAt: new Date(),
                },
            }),
        ]);
    };

    const handleLoadGraph = async ({
        name,
    }: {
        name: string;
    }): Promise<{
        id: IdType;
        name: string;
        nodes: INode[];
        links: ILink[];
        comments: IComment[];
        tags: ITag[];
    }> => {
        console.log('loading graph');
        const graph = await sqliteDataMapper.graph.findFirst({
            where: {
                name,
            },
            include: {
                nodes: {
                    include: {
                        Attribute: true,
                        TaggedWith: true,
                    },
                },
                links: true,
                comments: true,
                tags: true,
            },
        });

        if (!graph) {
            return {
                id: 0,
                name: '',
                nodes: [],
                links: [],
                comments: [],
                tags: [],
            };
        }

        return {
            id: 0,
            name: graph.name,
            nodes: graph.nodes
                .filter((n) => !n.deletedAt)
                .map((n) => ({
                    id: n.id,
                    name: n.name,
                    tags: n.TaggedWith.map((t) => t.tagId),
                    attributes: n.Attribute.map((a) => ({
                        id: a.id,
                        key: a.key,
                        value: a.value,
                    })),
                })),
            links: graph.links
                .filter((l) => !l.deletedAt)
                .map((l) => ({
                    id: l.id,
                    name: l.name,
                    node1Id: l.sourceId,
                    node2Id: l.targetId,
                    type: l.type as unknown as LINK_TYPE_ENUM,
                })),
            comments: graph.comments
                .filter((c) => !c.deletedAt)
                .map((c) => ({
                    id: c.id,
                    text: c.text,
                    targetId: c.nodeId as number,
                })),
            tags: graph.tags
                .filter((t) => !t.deletedAt)
                .map((t) => ({
                    name: t.name,
                    color: t.color,
                    id: t.id,
                })),
        };
    };

    const handleCreateComment = async ({
        graphId,
        comment,
    }: {
        graphId: IdType;
        comment: NewComment | IComment;
    }): Promise<IComment> => {
        const newComment = await sqliteDataMapper.comment.create({
            data: {
                graphId: graphId,
                text: comment.text,
                nodeId: comment.targetId,
            },
        });

        return {
            id: newComment.id,
            text: newComment.text,
            targetId: newComment.nodeId as number,
        };
    };

    const handleCreateLink = async ({
        graphId,
        link,
    }: {
        graphId: IdType;
        link: NewLink | ILink;
    }): Promise<ILink> => {
        const newLink = await sqliteDataMapper.link.create({
            data: {
                graphId: graphId,
                name: link.name,
                sourceId: link.node1Id,
                targetId: link.node2Id,
                type: link.type,
            },
        });

        return {
            id: newLink.id,
            name: newLink.name,
            node1Id: newLink.sourceId,
            node2Id: newLink.targetId,
            type: newLink.type as unknown as LINK_TYPE_ENUM,
        };
    };

    const handleCreateNode = async ({
        graphId,
        node,
    }: {
        graphId: IdType;
        node: NewNode | INode;
    }): Promise<INode> => {
        const newNode = await sqliteDataMapper.node.create({
            data: {
                graphId: graphId,
                name: node.name,
            },
        });

        return {
            id: newNode.id,
            name: newNode.name,
            tags: [],
        };
    };

    const handleCreateTag = async ({
        graphId,
        tag,
    }: {
        graphId: IdType;
        tag: NewTag | ITag;
    }): Promise<ITag> => {
        const newTag = await sqliteDataMapper.tag.create({
            data: {
                color: tag.color,
                name: tag.name,
                graphId: graphId,
            },
        });

        return {
            name: newTag.name,
            color: newTag.color,
            id: newTag.id,
        };
    };

    const handleDeleteComment = async ({
        graphId,
        commentId,
    }: {
        graphId: IdType;
        commentId: IdType;
    }): Promise<IComment> => {
        const comment = await sqliteDataMapper.comment.update({
            where: {
                id: commentId,
            },
            data: {
                deletedAt: new Date(),
            },
        });

        return {
            id: comment.id,
            text: comment.text,
            targetId: comment.nodeId as number,
        };
    };

    const handleDeleteLink = async ({
        graphId,
        linkId,
    }: {
        graphId: IdType;
        linkId: IdType;
    }): Promise<ILink> => {
        const link = await sqliteDataMapper.link.update({
            where: {
                id: linkId,
            },
            data: {
                deletedAt: new Date(),
            },
        });

        return {
            id: link.id,
            name: link.name,
            node1Id: link.sourceId,
            node2Id: link.targetId,
            type: link.type as unknown as LINK_TYPE_ENUM,
        };
    };

    const handleDeleteNode = async ({
        graphId,
        nodeId,
    }: {
        graphId: IdType;
        nodeId: IdType;
    }): Promise<INode> => {
        const tags = await sqliteDataMapper.tag.findMany({
            where: {
                deletedAt: null,
                TaggedWith: {
                    every: {
                        nodeId: nodeId,
                    },
                },
            },
        });

        const [node] = await sqliteDataMapper.$transaction([
            sqliteDataMapper.node.update({
                where: {
                    id: nodeId,
                },
                data: {
                    deletedAt: new Date(),
                },
            }),
            sqliteDataMapper.taggedWith.updateMany({
                where: {
                    nodeId: nodeId,
                },
                data: {
                    deletedAt: new Date(),
                },
            }),
        ]);

        return {
            id: node.id,
            name: node.name,
            tags: tags.map((t) => t.id),
        };
    };

    const handleDeleteTag = async ({
        graphId,
        tagId,
    }: {
        graphId: IdType;
        tagId: IdType;
    }): Promise<ITag> => {
        const [tag] = await sqliteDataMapper.$transaction([
            sqliteDataMapper.tag.update({
                where: {
                    id: tagId,
                },
                data: {
                    deletedAt: new Date(),
                },
            }),
            sqliteDataMapper.taggedWith.updateMany({
                where: {
                    tagId: tagId,
                },
                data: {
                    deletedAt: new Date(),
                },
            }),
        ]);

        return {
            name: tag.name,
            color: tag.color,
            id: tag.id,
        };
    };

    const handleUpdateComment = async ({
        graphId,
        comment,
    }: {
        graphId: IdType;
        comment: IComment;
    }): Promise<IComment> => {
        const result = await sqliteDataMapper.comment.update({
            where: {
                id: comment.id,
            },
            data: {
                text: comment.text,
                nodeId: comment.targetId,
            },
        });
        return {
            id: result.id,
            text: result.text,
            targetId: result.nodeId as number,
        };
    };

    const handleUpdateLink = async ({
        graphId,
        link,
    }: {
        graphId: IdType;
        link: ILink;
    }): Promise<ILink> => {
        const result = await sqliteDataMapper.link.update({
            where: {
                id: link.id,
            },
            data: {
                name: link.name,
                sourceId: link.node1Id,
                targetId: link.node2Id,
                type: link.type,
            },
        });
        return {
            id: result.id,
            name: result.name,
            node1Id: result.sourceId,
            node2Id: result.targetId,
            type: result.type as unknown as LINK_TYPE_ENUM,
        };
    };

    const handleUpdateNode = async ({
        graphId,
        node,
    }: {
        graphId: IdType;
        node: INode;
    }): Promise<INode> => {
        const result = await sqliteDataMapper.node.update({
            where: {
                id: node.id,
            },
            data: {
                name: node.name,
            },
        });
        return {
            id: result.id,
            name: result.name,
            tags: [],
        };
    };

    const handleUpdateTag = async ({
        graphId,
        tag,
    }: {
        graphId: IdType;
        tag: ITag;
    }): Promise<ITag> => {
        const result = await sqliteDataMapper.tag.update({
            where: {
                id: tag.id,
            },
            data: {
                name: tag.name,
                color: tag.color,
            },
        });

        return {
            name: result.name,
            color: result.color,
            id: result.id,
        };
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
