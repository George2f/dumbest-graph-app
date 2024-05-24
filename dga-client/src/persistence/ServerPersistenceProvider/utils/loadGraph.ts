import { HttpResponse, http } from 'msw';
import getApiBase from '../../../api/getApiBase';
import getApiClient from '../../../api/getApiClient';
import IdType from '../../../types/IdType';
import INode from '../../../types/INode';
import ILink from '../../../types/ILink';
import IComment from '../../../types/IComment';
import ITag from '../../../types/ITag';

export default function loadGraph({ name }: { name: string }) {
    return getApiClient()
        .get<{
            id: IdType;
            name: string;
            nodes: INode[];
            links: ILink[];
            comments: IComment[];
            tags: ITag[];
        }>(`/api/v1/graphs/${name}`)
        .then((res) => res.data);
}

export function loadGraphMock() {
    return http.get(`${getApiBase()}/api/v1/graphs/:name`, (req) => {
        return HttpResponse.json<{
            id: IdType;
            name: string;
            nodes: INode[];
            links: ILink[];
            comments: IComment[];
            tags: ITag[];
        }>({
            id: 1,
            name: 'Hello, World!',
            nodes: [],
            links: [],
            comments: [],
            tags: [],
        });
    });
}
