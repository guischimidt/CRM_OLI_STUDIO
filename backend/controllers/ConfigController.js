const Procedure = require('../models/Procedure');
const Payment = require('../models/Payment');

const ObjectId = require('mongoose').Types.ObjectId;

module.exports = class ConfigController {

    static async createPayment(req, res) {

        let { name, tax } = req.body;

        //validation
        if (!name) {
            res.status(422).json({ message: "O nome é obrigatório!" });
            return;
        }
        if (!tax) {
            res.status(422).json({ message: "A taxa é obrigatória!" });
            return;
        }

        //create a payment
        const payment = new Payment({
            name,
            tax,
        });

        try {
            const newPayment = await payment.save();
            res.status(201).json({ message: 'Pagamento cadastrado com sucesso', newPayment, });

        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async getAllPayments(req, res) {
        const payments = await Payment.find().sort('name');

        res.status(200).json({ payments: payments, });
    }

    static async getByIdPayments(req, res) {
        const id = req.params.id;

        const payment = await Payment.findOne({ _id: id });

        res.status(200).json({ payment });
    }

    static async updatePayment(req, res) {

        const id = req.params.id;
        let { name, tax} = req.body;

        const updatedData = {};

        // check if id is valid
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' });
            return;
        }

        // check if payment exists
        const payment = await Payment.findOne({ _id: id });

        if (!payment) {
            res.status(404).json({ message: 'Forma de pagamento não encontrada!' });
            return;
        }

        //validation
        if (!name) {
            res.status(422).json({ message: "A froma de pagamento é obrigatória!" });
            return;
        } else {
            updatedData.name = name;
        }
        if (!tax) {
            res.status(422).json({ message: "A taxa é obrigatória" });
            return;
        } else {
            updatedData.tax = tax;
        }

        await Payment.findByIdAndUpdate(id, updatedData);

        res.status(200).json({ payment: payment, message: 'Forma de pagamento atualizada com sucesso!' })


    }

    static async removePayment(req, res) {
        const id = req.params.id;

        // check if id is valid
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' });
            return;
        }

        // check if payment exists
        const payment = await Payment.findOne({ _id: id });

        if (!payment) {
            res.status(404).json({ message: 'Forma de pagamento não encontrada!' });
            return;
        }

        await Payment.findByIdAndRemove(id);

        res.status(200).json({message: 'Forma de pagamento removida!'});

    }

    //create a Procedure
    static async createProcedure(req, res) {

        let { name, price, days_message, time, color } = req.body;

        //validation
        if (!name) {
            res.status(422).json({ message: "O procedimento é obrigatório!" });
            return;
        }
        if (!price) {
            res.status(422).json({ message: "O preço é obrigatório" });
            return;
        }
        if (!days_message) {
            res.status(422).json({ message: "O prazo para mensagem é obrigatório!" });
            return;
        }
        if (!time) {
            res.status(422).json({ message: "O tempo de duração é obrigatório!" });
            return;
        } else {
            time = time.replace(',', '.');
        }
        if (!color) {
            res.status(422).json({message: "A cor é obrigatória!"});
        }

        //create a procedure
        const procedure = new Procedure({
            name,
            price,
            days_message,
            time,
            color,
        });

        try {
            const newProcedure = await procedure.save();
            res.status(201).json({ message: 'Procedimento cadastrado com sucesso', newProcedure, });

        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async getAllProcedures(req, res) {
        const procedures = await Procedure.find().sort('name');

        res.status(200).json({ procedures: procedures, });
    }

    static async getByIdProcedures(req, res) {
        const id = req.params.id;

        const procedure = await Procedure.findOne({ _id: id });

        res.status(200).json({ procedure });
    }

    static async updateProcedure(req, res) {

        const id = req.params.id;
        let { name, price, days_message, time, color} = req.body;

        const updatedData = {};

        // check if id is valid
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' });
            return;
        }

        // check if procedure exists
        const procedure = await Procedure.findOne({ _id: id });

        if (!procedure) {
            res.status(404).json({ message: 'Procedimento não encontrado!' });
            return;
        }

        //validation
        if (!name) {
            res.status(422).json({ message: "O procedimento é obrigatório!" });
            return;
        } else {
            updatedData.name = name;
        }
        if (!price) {
            res.status(422).json({ message: "O preço é obrigatório" });
            return;
        } else {
            updatedData.price = price;
        }
        if (!days_message) {
            res.status(422).json({ message: "O prazo para mensagem é obrigatório!" });
            return;
        } else {
            updatedData.days_message = days_message;
        }
        if (!time) {
            res.status(422).json({ message: "O tempo de duração é obrigatório!" });
            return;
        } else {
            time = time.replace(',', '.');
            updatedData.time = time;
        }
        if (!color) {
            res.status(422).json({message: "A cor é obrigatória!"});
        } else {
            updatedData.color = color;
        }

        await Procedure.findByIdAndUpdate(id, updatedData);

        res.status(200).json({ procedure: procedure, message: 'Procedimento atualizado com sucesso!' })


    }

    static async removeProcedure(req, res) {
        const id = req.params.id;

        // check if id is valid
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' });
            return;
        }

        // check if procedure exists
        const procedure = await Procedure.findOne({ _id: id });

        if (!procedure) {
            res.status(404).json({ message: 'Procedimento não encontrado!' });
            return;
        }

        await Procedure.findByIdAndRemove(id);

        res.status(200).json({message: 'Procedimento removido!'});

    }
}