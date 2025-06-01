# Electrical Grid Data Demonstractions

Greetings! This is Matthew Vaden's project on how transfer data between an API and a client via HTTP.

## Basics

This project is divided into two main parts: The Backend and the Front End.

The backend is served using Node.js and is using Express to setup routing. The

A `.csv` file, containing rows of data is also located at the root level of `/backend`, where it is being read under the route `/all-data`.

The front-end uses React for performing HTTP requests to receive data from the `/all-data` route, and render said rows to of data to the UI from the API.

## Instructions On How To Use

1. Using a DOTENV file or by hard-coding, set up your own port numbers on your local environment
2. Start the API entering either script from the your terminal: `npm run start` || `nodemon index.js`
3. Start React by entering either script from the your terminal: `npm run dev` || `vite`
4. After the API has started, try the following command to confirm that the API is running and data can be retrieved: `curl https://localhost:<PORT>/all-data` (the data may take a few seconds to return)
5. When the React server is running locally on your environment, execute the route `/all-data` in the address bar to access the UI side of the project
6. After the UI has loaded, enter a `Date-Time` value for the inputs labeled "Start Date" and "End Date", or use the default values provided
7. Click the "Get Records" button and observe the UI render the following section with the heading of "Totals, Means, and Medians"
   a. Total Usage (kWh): Sum of all `Usage_kWh` values returned within the selected date range
   b. Average Usage (kWh): The mean or average of all `Usage_kWh` values returned within the date range
   c. Day of Week: The day associated with each record
   d. Type of Load: The type of load associated with each record
8. Optionally, select one or more options for "Day of Week" and click "Get Records" button to refine your query, based on the days of the week selected
9. Optionally, select one or more options for "Type of Load" and click "Get Records" button to refine your query, based on the type(s) of load selected
   10: Sections "Totals, Means, and Medians" and "Energy Usage Table Data" will be mounted and rendered in the UI once the GET HTTP request for records is successful

## Other Notes

- No need to use docker, or running in a container.
- This project uses React `v19.1.2` and runs on Node.js `v23.6.0`

## Questions

Contact: matthewvaden@gmail.com
