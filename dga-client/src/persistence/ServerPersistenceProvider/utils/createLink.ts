import { HttpResponse, http } from 'msw';
import getApiBase from '../../../api/getApiBase';
import IdType from '../../../types/IdType';
import ILink, { NewLink } from '../../../types/ILink';
import getApiClient from '../../../api/getApiClient';
import LINK_TYPE_ENUM from '../../../types/LinkTypeEnum';

export default function createLink({
    graphId,
    link,
}: {
    graphId: IdType;
    link: NewLink | ILink;
}) {
    return getApiClient()
        .post<ILink>(`/api/v1/graph/${graphId}/links`, {
            node1Id: link.node1Id,
            node2Id: link.node2Id,
            type: link.type,
            name: link.name,
        })
        .then((res) => res.data);
}

export function createLinkMock() {
    return http.post(`${getApiBase()}/api/v1/graph/:id/links`, () => {
        return HttpResponse.json<ILink>(
            {
                id: 1,
                node1Id: 1,
                node2Id: 2,
                type: LINK_TYPE_ENUM.BOTH_WAYS,
                name: 'test',
            },
            { status: 200 }
        );
    });
}
