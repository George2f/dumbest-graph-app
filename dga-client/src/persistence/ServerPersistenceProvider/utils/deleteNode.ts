import { HttpResponse, http } from 'msw';
import getApiBase from '../../../api/getApiBase';
import IdType from '../../../types/IdType';
import getApiClient from '../../../api/getApiClient';
import INode from '../../../types/INode';

export default function deleteNode({
    graphId,
    nodeId,
}: {
    graphId: IdType;
    nodeId: IdType;
}) {
    return getApiClient()
        .delete<INode>(`/api/v1/graphs/${graphId}/nodes/${nodeId}`)
        .then((res) => res.data);
}

export function deleteNodeMock() {
    return http.delete(
        `${getApiBase()}/api/v1/graphs/:id/nodes/:nodeId`,
        (req) => {
            return HttpResponse.json<INode>({
                id: parseInt(req.params.nodeId as string),
                name: 'Hello, World!',
                tags: [],
            });
        }
    );
}
