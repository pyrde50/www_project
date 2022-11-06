import http from "k6/http";

export const options = {
  duration: '10s',
  vus: 20,
}

export default function () {
  http.get('http://localhost:7778')
}




// npm test -- tests/express.test.js