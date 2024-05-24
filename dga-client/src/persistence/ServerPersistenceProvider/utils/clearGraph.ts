import { HttpResponse, http } from 'msw';
import getApiBase from '../../../api/getApiBase';
import getApiClient from '../../../api/getApiClient';
import IdType from '../../../types/IdType';

export default function clearGraph({ id }: { id: IdType }) {
    return getApiClient()
        .delete<void>(`/api/v1/graphs/${id}`)
        .then((res) => res.data);
}

export function clearGraphMock() {
    return http.delete(`${getApiBase()}/api/v1/graphs/:id`, () => {
        return HttpResponse.json<undefined>(undefined, { status: 204 });
    });
}
