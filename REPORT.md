Quick information about the project.
- Uses Node.js and express to implement bit.ly inmplementations.
- Node runs in port 7777 and express in port 7778.
- the scripts below start both of the servers at the same time

Running the project:
run command:
- npm run docker

or if you want to install the application on your own device
- npm install && npm run start


## note on testing: the docker file or the application must be running during testing, the test scripts do not open the server... i.e run npm run docker in a seperate terminal window before running tests
There are 6 different test scripts, 3 for the Node.js implementation, 3 for express implementation. These can be run with the scripts:
- npm run k6-express-get-home           // express get home
- npm run k6-express-get-redirect       // express get redirect
- npm run k6-express-post               // express post new URL
- npm run k6-node-get-home              // node get home
- npm run k6-node-get-redirect          // node get redirect
- npm run k6-node-post                  // node post new URL

The tests were run for 10 seconds with 20 concurrent users for each test

## note average requests per second and median requests per second are shown in realtion to one user

Test results:
## Express home:
- Average requests per second: 1/0.00207 = 483
- Median requests per second: 1/0.00173 = 578
- 95th precentile: 3.82 ms
- 99th precentile: 5.36 ms

## Express redirect:
- Average requests per second: 1/0.10587 = 9.45
- Median requests per second: 1/0.03227 = 30.99
- 95th precentile: 736.71 ms
- 99th precentile: 882.83 ms

## Express post:
- Average requests per second: 1/0.19824 = 5.04
- Median requests per second: 1/0.03956 = 25.28
- 95th precentile: 895 ms
- 99th precentile: 917 ms

## Node home:
- Average requests per second: 1/0.00142 = 704 
- Median requests per second: 1/0.00115 = 870
- 95th precentile: 2.62 ms
- 99th precentile: 3.97 ms

## Node redirect:
- Average requests per second: 1/0.09169 = 10.9
- Median requests per second: 1/0.03451 = 28.98
- 95th precentile: 697.92 ms
- 99th precentile: 744.48 ms

## Node post:
- Average requests per second: 1/0.18804 = 5.32
- Median requests per second: 1/0.0341 = 29.33
- 95th precentile: 965.75ms
- 99th precentile: 1000s

The fastest endpoint on both the node and the express server was the home endpoint. This is clearly due to the fact it only returns a textbox for each and every GET request it recieves. Node was a bit faster in this implementation and in my opinion this is due to the fact that it's programmed using the javascript run environment without any libraries on top of it so it's a bit faster due to that. The second fastest request was the redirect on both node and express. This is very similar to the previous test results as the node version is a bit faster compared to the express one. The reason why gettng the redirect is slower compared to the home page is because we need to communicate with the database. Finally the slowest request for both was the post request. Node was again faster, although for some reason node had the higer 95th and 99th precentile requests. 