import http from "k6/http";

export const options = {
  duration: '10s',
  vus: 20,
}

export default function () {
  http.post('http://localhost:7777/', {url: 'https://into.aalto.fi/'})
}