import { HttpResponse, http } from 'msw';
import getApiBase from '../../../api/getApiBase';
import IdType from '../../../types/IdType';
import IComment from '../../../types/IComment';
import getApiClient from '../../../api/getApiClient';

export default function updateComment({
    graphId,
    comment,
}: {
    graphId: IdType;
    comment: IComment;
}) {
    return getApiClient()
        .put<IComment>(
            `/api/v1/graphs/${graphId}/comments/${comment.id}`,
            comment
        )
        .then((res) => res.data);
}

export function updateCommentMock() {
    return http.put(
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
