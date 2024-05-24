import { HttpResponse, http } from 'msw';
import getApiBase from '../../../api/getApiBase';
import IdType from '../../../types/IdType';
import INode, { NewNode } from '../../../types/INode';
import getApiClient from '../../../api/getApiClient';

export default function createNode({
    graphId,
    node,
}: {
    graphId: IdType;
    node: NewNode | INode;
}) {
    return getApiClient()
        .post<INode>(`/api/v1/graphs/${graphId}/nodes`, {
            name: node.name,
        })
        .then((res) => res.data);
}

export function createNodeMock() {
    return http.post(`${getApiBase()}/api/v1/graphs/:id/nodes`, (req) => {
        return HttpResponse.json<INode>({
            id: 1,
            name: 'Hello, World!',
            tags: [],
        });
    });
}
