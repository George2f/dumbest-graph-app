import { HttpResponse, http } from 'msw';
import getApiBase from '../../../api/getApiBase';
import IdType from '../../../types/IdType';
import ITag, { NewTag } from '../../../types/ITag';
import getApiClient from '../../../api/getApiClient';

export default function createTag({
    graphId,
    tag,
}: {
    graphId: IdType;
    tag: NewTag | ITag;
}) {
    return getApiClient()
        .post<ITag>(`/api/v1/graphs/${graphId}/tags`, {
            color: tag.color,
            name: tag.name,
        })
        .then((res) => res.data);
}

export function createTagMock() {
    return http.post(`${getApiBase()}/api/v1/graphs/:id/tags`, (req) => {
        return HttpResponse.json<ITag>({
            id: 1,
            name: 'Hello, World!',
            color: '#000000',
        });
    });
}
