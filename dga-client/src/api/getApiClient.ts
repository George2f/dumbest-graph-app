import axios from 'axios';
import getApiBase from './getApiBase';

const axiosClient = axios.create({
    baseURL: getApiBase(),
    headers: {
        'Content-Type': 'application/json',
    },
});

export default function getApiClient() {
    return axiosClient;
}
