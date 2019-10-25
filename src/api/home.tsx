import axios from '.';
export function getSliders() {
    return axios.get('/getSliders');
}
export function getLessons(currentCategory: string = 'all', offset: number = 0, limit: number = 5) {
    return axios.get(`/getLessons?category=${currentCategory}&offset=${offset}&limit=${limit}`);
}