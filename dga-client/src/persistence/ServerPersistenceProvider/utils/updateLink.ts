import { HttpResponse, delay, http } from 'msw';
import getApiBase from '../../../api/getApiBase';
import IdType from '../../../types/IdType';
import ILink from '../../../types/ILink';
import getApiClient from '../../../api/getApiClient';
import LINK_TYPE_ENUM from '../../../types/LinkTypeEnum';

export default function updateLink({
    graphId,
    link,
}: {
    graphId: IdType;
    link: ILink;
}) {
    return getApiClient()
        .put<ILink>(`/api/v1/graphs/${graphId}/links/${link.id}`, link)
        .then((res) => res.data);
}

export function updateLinkMock() {
    return http.put(
        `${getApiBase()}/api/v1/graphs/:id/links/:linkId`,
        async (req) => {
            await delay(120);
            return HttpResponse.json<ILink>({
                id: parseInt(req.params.linkId as string),
                node1Id: 1,
                node2Id: 2,
                name: 'test',
                type: LINK_TYPE_ENUM.A_TO_B,
            });
        }
    );
}
