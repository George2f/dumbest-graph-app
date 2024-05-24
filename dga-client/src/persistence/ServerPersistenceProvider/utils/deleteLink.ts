import { HttpResponse, http } from 'msw';
import getApiBase from '../../../api/getApiBase';
import ILink from '../../../types/ILink';
import getApiClient from '../../../api/getApiClient';
import IdType from '../../../types/IdType';
import LINK_TYPE_ENUM from '../../../types/LinkTypeEnum';

export default function deleteLink({
    graphId,
    linkId,
}: {
    graphId: IdType;
    linkId: IdType;
}) {
    return getApiClient()
        .delete<ILink>(`/api/v1/graphs/${graphId}/link/${linkId}`)
        .then((res) => res.data);
}

export function deleteLinkMock() {
    return http.delete(
        `${getApiBase()}/api/v1/graphs/:id/link/:linkId`,
        (req) => {
            return HttpResponse.json<ILink>({
                id: parseInt(req.params.linkId as string),
                name: 'Hello, World!',
                node1Id: 1,
                node2Id: 2,
                type: LINK_TYPE_ENUM.A_TO_B,
            });
        }
    );
}
