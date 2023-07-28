import api from '../../../utils/api'

import styles from './ConfigProceduresAdd.module.css';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

//Components 
import PaymentForm from '../../form/PaymentForm';

//hooks
import useFlashMessage from '../../../hooks/useFlashMessage';

function ConfigPaymentsAdd() {
    const { setFlashMessage } = useFlashMessage();
    const navigate = useNavigate();
    const [token] = useState(localStorage.getItem('token') || '');


    async function registerPayment(payment) {
        let msgType = "success";

        const data = await api.post('config/payments/create', payment, {
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
            navigate('/config/payments');
        }
    };

    return (
        <section className={styles.proceduresadd_header}>
            <div >
                <h1>Cadastro de Pagamentos</h1>
            </div>
            <PaymentForm handleSubmit={registerPayment} btnText="Cadastrar" />
        </section>
    );
};

export default ConfigPaymentsAdd;