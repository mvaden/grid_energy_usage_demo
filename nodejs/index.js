require('dotenv').config();
const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require("cors");
const app = express();
const serverPort = process.env.SERVER_PORT;
const clientPort = process.env.CLIENT_PORT;
const CSV_PATH = 'Steel_industry_data.csv';

app.use((req, res, next) => {
    cors({
        origin: [ `"http://localhost:${clientPort}` ]
    });
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/', (req, res) => res.send({ "message": "API is working"}));

app.get('/all-data', (req, res) => {
    const results = [];

    fs.createReadStream(CSV_PATH)
    .pipe(csv())
    .on('data', (data) => {
        results.push({
            date: data.date,
            Day_of_week: data.Day_of_week,
            'Lagging_Current_Reactive.Power_kVarh': parseFloat(data['Lagging_Current_Reactive.Power_kVarh']),
            'Leading_Current_Reactive_Power_kVarh': parseFloat(data['Leading_Current_Reactive_Power_kVarh']),
            'CO2(tCO2)': parseFloat(data['CO2(tCO2)']),
            'Lagging_Current_Power_Factor': parseFloat(data['Lagging_Current_Power_Factor']),
            'Leading_Current_Power_Factor': parseFloat(data['Leading_Current_Power_Factor']),
            Load_Type: data.Load_Type,
            NSM: parseInt(data.NSM),
            Usage_kWh: parseFloat(data.Usage_kWh),
            WeekStatus: data.WeekStatus
        });
    })
    .on('end', () => {
        res.status(200).json({
            Message: results,
            TotalRecords: results.length,
            Success: true,
        });
    })
    .on('error', (error) => {
        res.status(500).json({
            Error: 'Failed to read CSV file',
            Message: error,
            Success: false
        });
    });
});

app.listen(serverPort, () => console.log(serverPort));