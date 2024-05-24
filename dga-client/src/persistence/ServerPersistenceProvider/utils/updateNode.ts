import { HttpResponse, delay, http } from 'msw';
import getApiBase from '../../../api/getApiBase';
import IdType from '../../../types/IdType';
import INode from '../../../types/INode';
import getApiClient from '../../../api/getApiClient';

export default function updateNode({
    graphId,
    node,
}: {
    graphId: IdType;
    node: INode;
}) {
    return getApiClient()
        .put<INode>(`/api/v1/graphs/${graphId}/nodes/${node.id}`, node)
        .then((res) => res.data);
}

export function updateNodeMock() {
    return http.put(
        `${getApiBase()}/api/v1/graphs/:id/nodes/:nodeId`,
        async (req) => {
            await delay(120);
            return HttpResponse.json<INode>({
                id: parseInt(req.params.nodeId as string),
                name: 'Hello, World!',
                tags: [],
            });
        }
    );
}
