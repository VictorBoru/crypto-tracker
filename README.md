Crypto Tracker
Description
Crypto Tracker is a web application that allows users to search for and visualize cryptocurrency prices over a range of date periods. It uses the Binance API to fetch cryptocurrency data and displays the price of a selected cryptocurrency in a line chart format.

Technologies Used
Frontend:

React: UI Library for building the frontend.
React Bootstrap: Component library for styling and layout.
CCXT: Cryptocurrency trading library for fetching market data.
Chart.js: Charting library for data visualization.
Backend:

Express: Node.js web application framework.
MongoDB: Database for storing logged search terms and selected cryptocurrencies.
Mongoose: ODM (Object Data Modeling) library for MongoDB and Node.js.
Body-parser: Middleware to handle request body parsing.
CORS: Middleware to enable Cross-Origin Resource Sharing.
Features Implemented
Cryptocurrency Search: Allows users to search for any cryptocurrency available on Binance.
Price Visualization: Displays the price trend of a selected cryptocurrency over 1 day, 7 days, or 30 days.
Logging: Backend logging of search terms and selected cryptocurrencies for analytics.
Project Setup
Frontend Setup:

1.1. Install the required packages:

npm install react react-dom react-bootstrap ccxt chart.js

1.2. Start the development server:

npm start

1.3. Navigate to http://localhost:3000 in your browser.

Backend Setup:

2.1. Install the required packages:

npm install express body-parser mongoose cors

2.2. Ensure MongoDB is set up and running.

2.3. Update MONGO_URI in the server code to point to your MongoDB instance.

2.4. Start the backend server:

node index.js

2.5. The backend server should be running on http://localhost:3002.

Usage
On the main page, start typing in the search bar to find a cryptocurrency.
From the dropdown list, select a cryptocurrency.
Choose the date range for which you want to view the price trend: 1 day, 7 days, or 30 days.
View the line chart to see the price trend of the selected cryptocurrency for the specified date range.