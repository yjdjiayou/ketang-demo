import axios from './';
export function getLesson(id: string) {
    return axios.get(`/getLesson/${id}`);
}