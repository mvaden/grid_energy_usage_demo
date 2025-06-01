require('dotenv').config();
const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require("cors");
const app = express();
const serverPort = process.env.SERVER_PORT || 4000;
const clientPort = process.env.CLIENT_PORT || 5173;
const CSV_PATH = 'Steel_industry_data.csv';

app.use((req, res, next) => {
    cors({
        origin: [ `"http://localhost:${clientPort}` ]
    });
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send({ "message": "API is working"});
});

app.get('/all-data', (req, res) => {
  const results = [];

  fs.createReadStream(CSV_PATH)
    .pipe(csv())
    .on('data', (data) => {
        const processedData = {
            date: data.date,
            Usage_kWh: parseFloat(data.Usage_kWh),
            'Lagging_Current_Reactive.Power_kVarh': parseFloat(data['Lagging_Current_Reactive.Power_kVarh']),
            'Leading_Current_Reactive_Power_kVarh': parseFloat(data['Leading_Current_Reactive_Power_kVarh']),
            'CO2(tCO2)': parseFloat(data['CO2(tCO2)']),
            'Lagging_Current_Power_Factor': parseFloat(data['Lagging_Current_Power_Factor']),
            'Leading_Current_Power_Factor': parseFloat(data['Leading_Current_Power_Factor']),
            NSM: parseInt(data.NSM),
            WeekStatus: data.WeekStatus,
            Day_of_week: data.Day_of_week,
            Load_Type: data.Load_Type
      };
      results.push(processedData);
    })
    .on('end', () => {
      res.json({
        success: true,
        totalRecords: results.length,
        data: results
      });
    })
    .on('error', (error) => {
      res.status(500).json({
        success: false,
        error: 'Failed to read CSV file',
        message: error.message
      });
    });
});

app.listen(serverPort, () => console.log(serverPort));