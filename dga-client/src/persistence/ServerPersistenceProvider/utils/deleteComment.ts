import { HttpResponse, http } from 'msw';
import getApiBase from '../../../api/getApiBase';
import IdType from '../../../types/IdType';
import IComment from '../../../types/IComment';
import getApiClient from '../../../api/getApiClient';

export default function deleteComment({
    graphId,
    commentId,
}: {
    graphId: IdType;
    commentId: IdType;
}) {
    return getApiClient()
        .delete<IComment>(`/api/v1/graphs/${graphId}/comments/${commentId}`)
        .then((res) => res.data);
}

export function deleteCommentMock() {
    return http.delete(
        `${getApiBase()}/api/v1/graphs/:id/comments/:commentId`,
        (req) => {
            return HttpResponse.json<IComment>({
                id: parseInt(req.params.commentId as string),
                text: 'Hello, World!',
                targetId: 1,
            });
        }
    );
}
