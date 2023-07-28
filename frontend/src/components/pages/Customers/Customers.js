import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import Moment from 'moment';

import api from '../../../utils/api';

//Styles
import styles from '../../layout/Container.module.css';
import tableStyle from '../../layout/Table.module.css';

import * as BsIcons from 'react-icons/bs';

//hooks
import useFlashMessage from '../../../hooks/useFlashMessage';

function Customers() {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const { setFlashMessage } = useFlashMessage();

    const [name, setName] = useState("");

    const [token] = useState(localStorage.getItem('token') || '');


    function handleChange(e) {
        setName(e.target.value);
    };

    useEffect(() => {

        api.get('/customers', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            }
        })
            .then((response) => {
                setCustomers(response.data.customers);
            });

    }, [token]);

    function filter(e) {
        e.preventDefault();

        if (name !== '') {
            api.get(`/customers/name/${name}`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,
                }
            })
                .then((response) => {
                    setCustomers(response.data.customers);
                });

            setName("");

        } else {
            api.get('/customers', {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,
                }
            })
                .then((response) => {
                    setCustomers(response.data.customers);
                });
        }
    }

    async function removeCustomer(id) {
        let msgType = 'success';

        const data = await api.delete(`/customers/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            }
        })
            .then((response) => {
                const updatedCustomers = customers.filter((customer) => customer._id !== id);
                setCustomers(updatedCustomers);
                return response.data;
            })
            .catch((err) => {
                msgType = 'error';
                return err.response.data;
            })

        setFlashMessage(data.message, msgType);

    }

    return (
        <section>
            <div className={styles.container_header}>
                <h1>Clientes</h1>
                <button onClick={() => navigate('/customers/add')}>Cadastrar Cliente</button>
            </div>

            <form onSubmit={filter} className={styles.form_container}>
                <div className={styles.item_container}>
                <label htmlFor='name'>Nome</label>
                <input
                    text="Nome"
                    type="text"
                    name="name"
                    placeholder="Digite o nome da cliente"
                    onChange={handleChange}
                    value={name || ""}
                />

                <button type="submit" >
                    <BsIcons.BsSearch />
                </button>
                </div>
            </form>

            {<table className={tableStyle.table}>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Última Visita</th>
                        <th>Valor Gasto</th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {customers.length > 0 &&
                        customers.map((customer) => (
                            <tr key={customer._id}>
                                <td className={tableStyle.bold}>{customer.name}</td>
                                <td>{customer.last_visit 
                                ? Moment(`${customer.last_visit}`).format('DD/MM/YYYY') 
                                : ""}</td>
                                <td>R$ {customer.amount > 0 
                                ? parseFloat(customer.amount).toFixed(2).replace('.', ',')
                                : "0,00"}</td>
                                <td><BsIcons.BsFillCalendarDateFill onClick={() => navigate(`/schedule/add/${customer._id}`)} /></td>
                                <td><BsIcons.BsFillPencilFill onClick={() => navigate(`/customers/edit/${customer._id}`)} /></td>
                                <td><BsIcons.BsFillTrashFill onClick={() => removeCustomer(customer._id)} /></td>
                                {customers.length === 0 && <td>Nenhum resultado encontrado</td>}
                            </tr>
                        ))
                    }

                </tbody>
            </table>}
        </section>
    )
}

export default Customers;