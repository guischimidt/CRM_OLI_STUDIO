const Schedule = require('../models/Schedule');
const { google } = require('googleapis');
const mongoose = require('mongoose');
const moment = require("moment");
const { calendar } = require("../helpers/google-auth")
require('dotenv').config();

var axios = require('axios');
var qs = require('qs');

const ObjectId = require('mongoose').Types.ObjectId;

async function sendMessage(message, phone, id, message_type) {

    var data = qs.stringify({
        'id': phone,
        'message': message
    });
    var config = {
        method: 'post',
        url: process.env.WPP_API_URL,
        headers: {},
        data: data
    };

    await axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });

    updatedData = {};
    if (message_type === "Reschedule")
        updatedData.reschedule_message = true;
    else if (message_type === "Remember")
        updatedData.remember_message = true;

    console.log(id);
    await Schedule.findByIdAndUpdate(id, updatedData);
}

module.exports = class ScheduleController {

    static async getAll(req, res) {
        const schedules = await Schedule.find().sort('-startTime').limit(120);

        res.status(200).json({ schedules: schedules, });
    }

    static async getByName(req, res) {
        const name = req.params.name;

        const schedules = await Schedule.find({ "customer.name": { $regex: `${name}`, $options: 'i' } });

        res.status(200).json({ schedules: schedules, });
    }

    static async getByStatus(req, res) {
        const status = req.params.status;

        const schedules = await Schedule.find({ status: status });

        res.status(200).json({ schedules: schedules, });
    }

    static async verifyMessages(req, res) {
        function sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }
        console.log("Verificando mensagens pendentes");

        const schedules = await Schedule.find({ status: { $in: ['Pago', 'Criado', 'Remarcado'] } });

        const today = new Date();

        let tomorrow = moment().add(1, 'days').format("DD/MM");
        let last_day = moment().add(7, 'days').format("DD/MM");

        schedules.map((schedule) => {
            console.log(schedule.name);
            console.log(schedule._id);
            let days_message = schedule.procedures[0].days_message;
            let schedule_date = new Date(schedule.startTime);
            let schedule_edit_date = new Date(schedule.startTime);
            console.log(schedule_date);

            let message_type = "";
            let message = "";
            let phone = "55" + schedule.customer.phone;
            schedule_edit_date.setDate(schedule_edit_date.getDate() + days_message);
            console.log(schedule_edit_date);
            console.log(today);

            if (days_message > 0 && schedule_edit_date <= today && schedule.status === "Pago" && (!schedule.reschedule_message || schedule.reschedule_message === "" || schedule.reschedule_message === false)) {
                console.log(schedule_date + " é menor que " + today);
                let id = schedule._id;
                id = id.toString();
                message_type = "Reschedule";

                if (schedule.procedures[0].name === "Aplicação Unique")
                    message = `Boa tarde, tudo bem? Estou passando para saber como estão as extensões, está gostando? Qualquer dúvida é só me chamar, tá bom?`;
                else if (schedule.procedures[0].name === "Lash Lifting")
                    message = `Boa tarde, tudo bem? Estou passando para saber como está o seu Lash Lifting, está gostando? Qualquer dúvida é só me chamar, tá bom?`;
                else
                    message = `Boa tarde, tudo bem? Estou passando para lembrar de marcarmos a sua manutenção. Podemos agendar entre o dia ${tomorrow} até o dia ${last_day}. 🤍
                    
                    *Esta é uma mensagem automática, caso já tenha agendado sua manutenção, favor desconsiderar.*`;

                sleep(2000).then(() => {
                    console.log(message);
                    sendMessage(message, phone, id, message_type);
                });

            }

            if (moment(schedule_date).format("DD/MM/YYYY") === moment().add(1, 'days').format("DD/MM/YYYY") && (schedule.status === "Criado" || schedule.status === "Remarcado") && !schedule.remember_message) {
                let id = schedule._id;
                id = id.toString();
                let time = moment(schedule_date).format("HH:mm");
                message_type = "Remember"

                message = `Olá, tudo bem? Passando para te lembrar do nosso horário amanhã, às ${time}. Posso confirmar? 🤍`;

                sleep(2000).then(() => {
                    console.log(message);
                    sendMessage(message, phone, id, message_type);
                });

            }

        })
    }

    static async update(req, res) {
        const id = req.params.id;
        let { cancelStatus, schedule, payment } = req.body;

        const updatedData = {};

        // check if id is valid
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' });
            return;
        }

        // check if schedule exists
        const selectedSchedule = await Schedule.findOne({ _id: id });

        if (!selectedSchedule) {
            res.status(404).json({ message: 'Agendamento não encontrado!' });
            return;
        }

        if (cancelStatus) {
            console.log("Entrou cancelamento");
            const auth = new google.auth.GoogleAuth({
                credentials: {
                    client_email: process.env.GOOGLE_CLIENT_EMAIL,
                    private_key: process.env.GOOGLE_PRIVATE_KEY
                },
                scopes: process.env.SCOPES,
            });

            auth.getClient().then(async a => {
                calendar.events.delete({
                    auth: a,
                    calendarId: process.env.GOOGLE_CALENDAR_ID,
                    eventId: selectedSchedule.event_calendar._id,
                },
                    await function (err, event) {
                        if (err) {
                            res.status(422).json({ message: "Houve um erro: " + err });
                            return;
                        }
                    });
            });
            updatedData.status = "Cancelado";
        }

        if (payment && payment.paid) {
            console.log(payment)
            if (!payment.name || !payment.paid) {
                res.status(422).json({ message: "Forma de Pagamento e Valor Recebido são obrigatórios!" })
                return;
            }

            if (payment.paid)
                payment.paid = parseFloat(payment.paid);

            if (payment.paid2)
                payment.paid2 = parseFloat(payment.paid2);

            updatedData.payment = payment;
            updatedData.status = "Pago";

        }

        if (schedule && schedule.day && schedule.month && schedule.year && schedule.hour && schedule.minute) {
            console.log(schedule);
            let { day, month, year, hour, minute } = schedule;

            const procedures = selectedSchedule.procedures;
            console.log(procedures)

            let p_hours = 0;
            let p_minutes = 0;

            procedures.map((procedure) => {

                if (procedure.time !== "0") {
                    //procedure.time = procedure.time.split(":");
                    //console.log(parseInt(time[0]))
                    p_hours = parseInt(procedure.time[0]) + p_hours;
                    p_minutes = parseInt(procedure.time[1]) + p_minutes;

                    if (p_minutes === 60) {
                        p_hours++;
                        p_minutes = 0;
                    }
                }
            }
            );

            if (p_hours === 0) {
                p_hours = 1;
                p_minutes = 0;
            }

            if (day.length === 1)
                day = "0" + day;

            if (month.length === 1)
                month = "0" + month;

            if (hour.length === 1)
                hour = "0" + hour;

            const startTime = year + '-' + month + '-' + day + 'T' + hour + ':' + minute;

            updatedData.startTime = startTime;
            updatedData.status = "Remarcado";

            //create start date calendar google
            const start = year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':00-03:00';

            //create end event
            let { end_hour, end_minute } = 0;
            end_hour = parseInt(hour) + p_hours;
            end_minute = parseInt(minute) + p_minutes;

            if (end_minute === 60) {
                end_hour++;
                end_minute = end_minute - 60;
            }

            if (end_hour < 10)
                end_hour = "0" + end_hour;

            if (end_minute < 10)
                end_minute = "0" + end_minute;

            const end = year + '-' + month + '-' + day + 'T' + end_hour + ':' + end_minute + ':00-03:00';

            const event = {
                'summary': selectedSchedule.name,
                'location': 'Óli Studio - Eduarda Oliveira',
                'description': 'Remarcado',
                'start': {
                    'dateTime': start,
                    'timeZone': 'America/Sao_Paulo',
                },
                'end': {
                    'dateTime': end,
                    'timeZone': 'America/Sao_Paulo',
                },
                'colorId': parseInt(procedures[0].color),
                'sendUpdates': "all",
                'reminders': {
                    'useDefault': false,
                    'overrides': [
                        { 'method': 'email', 'minutes': 30 },
                        { 'method': 'popup', 'minutes': 30 },
                    ],
                },
            };

            const auth = new google.auth.GoogleAuth({
                credentials: {
                    client_email: process.env.GOOGLE_CLIENT_EMAIL,
                    private_key: process.env.GOOGLE_PRIVATE_KEY
                },
                scopes: process.env.SCOPES,
            });

            auth.getClient().then(async a => {
                calendar.events.update({
                    auth: a,
                    calendarId: process.env.GOOGLE_CALENDAR_ID,
                    eventId: selectedSchedule.event_calendar._id,
                    resource: event,
                },
                    await function (err, event) {
                        if (err) {
                            res.status(422).json({ message: "Houve um erro: " + err });
                            return;
                        }
                    });
            });
        }

        await Schedule.findByIdAndUpdate(id, updatedData);


        res.status(200).json({ schedule: selectedSchedule, message: 'Procedimento atualizado com sucesso!' })

    }

    static async create(req, res) {

        const customer = req.body[0];
        const procedures = req.body[1];
        let date = req.body[2];

        const comments = date.comments;

        if (!procedures) {
            res.status(422).json({ message: "Selecione pelo menos um procedimento!" });
            return;
        }

        if (!customer) {
            res.status(422).json({ message: "Cliente é obrigatório!" });
            return;
        }

        if (!date) {
            res.status(422).json({ message: "Data do procedimento é obrigatória!" });
        }

        //Create a procedure name
        let procedure_name = "";
        let p_hours = 0;
        let p_minutes = 0;

        procedures.map((procedure) => {
            procedure_name = procedure_name + " + " + procedure.name;

            if (procedure.time !== "0") {
                procedure.time = procedure.time.split(":");
                //console.log(parseInt(time[0]))
                p_hours = parseInt(procedure.time[0]) + p_hours;
                p_minutes = parseInt(procedure.time[1]) + p_minutes;

                if (p_minutes === 60) {
                    p_hours++;
                    p_minutes = 0;
                }


            }
        }
        );

        if (p_hours === 0) {
            p_hours = 1;
            p_minutes = 0;
        }

        //Create a summary
        procedure_name = procedure_name.substring(3);
        const event_name = procedure_name + ' (' + customer.name + ')';

        //create start event
        if (date.hour.length === 1)
            date.hour = "0" + date.hour;

        if (date.month.length === 1)
            date.month = "0" + date.month;

        if (date.day.length === 1)
            date.day = "0" + date.day;

        const start = date.year + '-' + date.month + '-' + date.day + 'T' + date.hour + ':' + date.minute + ':00-03:00';

        //create end event
        let { end_hour, end_minute } = 0;
        end_hour = parseInt(date.hour) + p_hours;
        end_minute = parseInt(date.minute) + p_minutes;

        if (end_minute === 60) {
            end_hour++;
            end_minute = end_minute - 60;
        }

        if (end_hour < 10)
            end_hour = "0" + end_hour;

        if (end_minute < 10)
            end_minute = "0" + end_minute;

        const end = date.year + '-' + date.month + '-' + date.day + 'T' + end_hour + ':' + end_minute + ':00-03:00';

        const event = {
            'summary': event_name,
            'location': 'Óli Studio - Eduarda Oliveira',
            'description': comments,
            'start': {
                'dateTime': start,
                'timeZone': 'America/Sao_Paulo',
            },
            'end': {
                'dateTime': end,
                'timeZone': 'America/Sao_Paulo',
            },
            'colorId': parseInt(procedures[0].color),
            'sendUpdates': "all",
            'reminders': {
                'useDefault': false,
                'overrides': [
                    { 'method': 'email', 'minutes': 30 },
                    { 'method': 'popup', 'minutes': 30 },
                ],
            },
        };

        //insert event in calendar google
        let event_id = "";
        async function insertDb() {
            console.log("Event id:" + event_id);

            const event_calendar = {
                _id: event_id
            };

            //FIX DATETIME MONGODB
            // date.hour = date.hour - 3;
            // end_hour = end_hour - 3;

            // if (date.hour < 10)
            //     date.hour = "0" + date.hour;

            // if (end_hour < 10)
            //     end_hour = "0" + end_hour;

            const startTime = date.year + '-' + date.month + '-' + date.day + 'T' + date.hour + ':' + date.minute;
            const endTime = date.year + '-' + date.month + '-' + date.day + 'T' + end_hour + ':' + end_minute;

            const schedule = await new Schedule({
                event_calendar,
                name: event_name,
                customer,
                procedures,
                startTime,
                endTime,
                status: "Criado",
                comments,
            });

            console.log(schedule);

            try {
                const newSchedule = await schedule.save();
                res.status(201).json({ message: 'Agendamento criado com sucesso', newSchedule, });

            } catch (error) {
                res.status(500).json({ message: "Erro:" + error });
            }

        }

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY
            },
            scopes: process.env.SCOPES,
        });

        auth.getClient().then(async a => {
            calendar.events.insert({
                auth: a,
                calendarId: process.env.GOOGLE_CALENDAR_ID,
                resource: event,
            },
                await function (err, event) {
                    if (err) {
                        res.status(422).json({ message: "Houve um erro: " + err });
                        return;
                    }
                    event_id = event.data.id;
                    insertDb();

                });
        });

    }
}