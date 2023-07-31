const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

require('dotenv').config();

var axios = require('axios');


//Import Routes
const UserRoutes = require('./routes/UserRoutes');
const CustomerRoutes = require('./routes/CustomerRoutes');
const ConfigRoutes = require('./routes/ConfigRoutes');
const ScheduleRoutes = require('./routes/ScheduleRoutes');

const app = express();

//config JSON response
app.use(express.json());

app.use((req, res, next) => {
  res.set('access-control-allow-origin', '*')
  res.set('access-control-allow-methods', '*')
  res.set('access-control-allow-headers', '*')
  app.use(cors({ credentials: true, origin: '*' }));

  next();
});

//public folder for images
app.use(express.static('public'));

//routes
app.use('/customers', CustomerRoutes);
app.use('/config', ConfigRoutes);
app.use('/schedules', ScheduleRoutes);
app.use('/users', UserRoutes);

//Cron
// cron.schedule("0 19 * * *", () => {
//   console.log("ENTROU");
//   var config = {
//     method: 'post',
//     url: 'http://192.168.0.10:5000/schedules/sendMessage/',
//     headers: {},
//   };

//   axios(config)
//     .then(function (response) {
//       console.log(response);
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// });

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));