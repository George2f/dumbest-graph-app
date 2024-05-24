import { HttpResponse, delay, http } from 'msw';
import getApiBase from '../../../api/getApiBase';
import IdType from '../../../types/IdType';
import ITag from '../../../types/ITag';
import getApiClient from '../../../api/getApiClient';

export default function updateTag({
    graphId,
    tag,
}: {
    graphId: IdType;
    tag: ITag;
}) {
    return getApiClient()
        .put<ITag>(`/api/v1/graphs/${graphId}/tag/${tag.id}`, tag)
        .then((res) => res.data);
}

export function updateTagMock() {
    return http.put(
        `${getApiBase()}/api/v1/graphs/:id/tag/:tagId`,
        async (req) => {
            await delay(120);
            return HttpResponse.json<ITag>({
                id: parseInt(req.params.tagId as string),
                color: '#000000',
                name: 'Hello, World!',
            });
        }
    );
}
