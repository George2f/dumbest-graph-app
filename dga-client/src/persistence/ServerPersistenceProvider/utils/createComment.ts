import { http, HttpResponse } from 'msw';
import getApiBase from '../../../api/getApiBase';
import getApiClient from '../../../api/getApiClient';
import IdType from '../../../types/IdType';
import IComment, { NewComment } from '../../../types/IComment';

export default function createComment({
    graphId,
    comment,
}: {
    graphId: IdType;
    comment: NewComment | IComment;
}) {
    return getApiClient()
        .post<IComment>(`/api/v1/graphs/${graphId}/comments`, {
            text: comment.text,
            targetId: comment.targetId,
        })
        .then((res) => res.data);
}

export function createCommentMock() {
    return http.post(`${getApiBase()}/api/v1/graphs/:id/comments`, (req) => {
        return HttpResponse.json<IComment>({
            id: 1,
            text: 'Hello, World!',
            targetId: 1,
        });
    });
}
