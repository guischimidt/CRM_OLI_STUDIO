const Customer = require('../models/Customer');

//helpers
// const getToken = require('../helpers/get-token');
// const getUserByToken = require('../helpers/get-user-by-token');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = class CustomersController {
    //create a Customer
    static async create(req, res) {

        let { name, cpf, phone, bday, bmonth, byear, comments } = req.body;

        //validation
        if (!name) {
            res.status(422).json({ message: "O nome é obrigatório!" });
            return;
        }
        if (!cpf) {
            // res.status(422).json({ message: "O CPF é obrigatório" });
            // return;
        } else {
            cpf = cpf.replace(/[^\d]+/g, '');

            // check if cpf exists
            const checkCPF = await Customer.findOne({ cpf });

            if (checkCPF) {
                res.status(422).json({ message: "CPF já cadastrado" });
                return;
            }
        }

        if (!phone) {
            res.status(422).json({ message: "O telefone é obrigatório!" });
            return;
        } else {
            phone = phone.replace(/[^\d]+/g, '');

            // check if cpf exists
            const checkPhone = await Customer.findOne({ phone });

            if (checkPhone) {
                res.status(422).json({ message: "Telefone já cadastrado" });
                return;
            }
        }
        // if (!bday || !bmonth || !byear) {
        //     res.status(422).json({ message: "A data de nascimento é obrigatória!" });
        //     return;
        // }

        //create a customer
        const customer = new Customer({
            name,
            cpf,
            phone,
            bday,
            bmonth,
            byear,
            comments,
        });

        try {
            const newCustomer = await customer.save();
            res.status(201).json({ message: 'Cliente cadastrada com sucesso', newCustomer, });

        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async getAll(req, res) {
        const customers = await Customer.find().sort('name');

        res.status(200).json({ customers: customers, });
    }

    static async getById(req, res) {
        const id = req.params.id;

        const customer = await Customer.findOne({ _id: id });

        res.status(200).json({ customer });
    }

    static async getByName(req, res) {
        const name = req.params.name;

        const customers = await Customer.find({ name: { $regex: `${name}`, $options: 'i' } }).sort('name');

        res.status(200).json({ customers: customers, });
    }

    static async update(req, res) {

        const id = req.params.id;
        let { name, cpf, phone, bday, bmonth, byear, comments, price, last_visit } = req.body;
        console.log(req.body);
        const updatedData = {};

        // check if id is valid
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' });
            return;
        }

        // check if customer exists
        let customer = await Customer.findOne({ _id: id });

        if (!customer) {
            res.status(404).json({ message: 'Cliente não encontrada!' });
            return;
        }

        //validation
        if (name) {
            updatedData.name = name;
        }
        if (cpf) {
            cpf = cpf.replace(/[^\d]+/g, '');
            updatedData.cpf = cpf;
        }
        if (phone) {
            phone = phone.replace(/[^\d]+/g, '');
            updatedData.phone = phone;
        }
        if (bday || bmonth || byear) {
            updatedData.bday = bday;
            updatedData.bmonth = bmonth;
            updatedData.byear = byear;
        }
        if (comments) {
            updatedData.comments = comments
        }
        if (price) {
            if (!customer.amount)
                customer.amount = 0;

            updatedData.last_visit = last_visit;
            updatedData.amount = parseFloat(customer.amount) + parseFloat(price);
        }

        await Customer.findByIdAndUpdate(id, updatedData);

        res.status(200).json({ customer: customer, message: 'Cliente atualizada com sucesso!' })

    }

    static async remove(req, res) {
        const id = req.params.id;

        // check if id is valid
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' });
            return;
        }

        // check if procedure exists
        const customer = await Customer.findOne({ _id: id });

        if (!customer) {
            res.status(404).json({ message: 'Cliente não encontrada!' });
            return;
        }

        await Customer.findByIdAndRemove(id);

        res.status(200).json({ message: 'Cliente removida!' });

    }


}