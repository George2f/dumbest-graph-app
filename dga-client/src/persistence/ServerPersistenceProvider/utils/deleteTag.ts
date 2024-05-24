import { HttpResponse, http } from 'msw';
import getApiBase from '../../../api/getApiBase';
import IdType from '../../../types/IdType';
import ITag from '../../../types/ITag';
import getApiClient from '../../../api/getApiClient';

export default function deleteTag({
    graphId,
    tagId,
}: {
    graphId: IdType;
    tagId: IdType;
}) {
    return getApiClient()
        .delete<ITag>(`/api/v1/graphs/${graphId}/comments/${tagId}`)
        .then((res) => res.data);
}

export function deleteTagMock() {
    return http.delete(
        `${getApiBase()}/api/v1/graphs/:id/comments/:tagId`,
        (req) => {
            return HttpResponse.json<ITag>({
                id: parseInt(req.params.tagId as string),
                color: '#000000',
                name: 'Hello, World!',
            });
        }
    );
}
