import axios from 'axios';

const BASE_API = 'https://pixabay.com/api/';
const API_KEY = '39034421-b12dee0d47925346f0305330d';
const perPage = 40;

export async function fetchImages(page, searchQuery) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page,
    per_page: perPage,
  });

  const resp = await axios.get(`${BASE_API}?${params}`);
  
//   console.log(resp.data);
  return resp.data;
}
