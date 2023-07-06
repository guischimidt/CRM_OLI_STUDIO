const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

var axios = require('axios');

//Import Routes
//const ScheduleRoutes = require('./routes/ScheduleRoutes');
const CustomerRoutes = require('./routes/CustomerRoutes');
const ConfigRoutes = require('./routes/ConfigRoutes');
const ScheduleRoutes = require('./routes/ScheduleRoutes');

const app = express();

//config JSON response
app.use(express.json());

//solve cors
app.use(cors({credentials: true, origin: 'http://192.168.0.10:3000'}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

//public folder for images
app.use(express.static('public'));

//routes
app.use('/customers', CustomerRoutes);
app.use('/config', ConfigRoutes);
app.use('/schedules', ScheduleRoutes);

//Cron
cron.schedule("0 19 * * *", () => {
  console.log("ENTROU");
  var config = {
    method: 'post',
    url: 'http://192.168.0.10:5000/schedules/sendMessage/',
    headers: {},
};

 axios(config)
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
});

app.listen(5000);