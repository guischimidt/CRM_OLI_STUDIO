import api from '../../../utils/api'

import styles from './CustomerAdd.module.css';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

//Components 
import CustomerForm from '../../form/CustomerForm';

//hooks
import useFlashMessage from '../../../hooks/useFlashMessage';


function CustomerAdd() {
    const { setFlashMessage } = useFlashMessage();
    const navigate = useNavigate();
    const [token] = useState(localStorage.getItem('token') || '');


    async function registerCustomer(customer) {
        let msgType = "success";

        const data = await api.post('customers/create', customer, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            }
        })
            .then((response) => {
                return response.data;
            })
            .catch((err) => {
                msgType = 'error';
                return err.response.data;
            });

        setFlashMessage(data.message, msgType);

        if (msgType !== 'error') {
            navigate('/');
        }
    };

    return (
        <section >
            <div className={styles.customeradd_header}>
                <h1>Cadastro de Clientes</h1>
            </div>
            <CustomerForm handleSubmit={registerCustomer} btnText="Cadastrar" />
        </section>
    );
};

export default CustomerAdd;