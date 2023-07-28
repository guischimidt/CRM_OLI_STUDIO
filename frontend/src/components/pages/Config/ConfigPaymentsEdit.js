import api from '../../../utils/api';
import { useState, useEffect } from 'react';
import styles from './ConfigProceduresAdd.module.css';
import PaymentForm from '../../form/PaymentForm';

//hooks
import useFlashMessage from '../../../hooks/useFlashMessage';
import { useParams, useNavigate } from 'react-router-dom';

function ConfigPaymentsEdit() {
    const [payment, setPayment] = useState([]);
    const { id } = useParams();
    const { setFlashMessage } = useFlashMessage();
    const navigate = useNavigate();
    const [token] = useState(localStorage.getItem('token') || '');


    useEffect(() => {
        api.get(`/config/payments/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            }
        })
            .then((response) => {
                setPayment(response.data.payment)
            })
    }, [id, token])

    async function updatePayment(payment) {
        let msgType = "success";

        const data = await api.patch(`config/payments/${payment._id}`, payment, {
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
        navigate('/config/payments');
    }

    return (
        <section>
            <div className={styles.proceduresadd_header}>
                <h1>Editando {payment.name}</h1>
                <p>Após a edição os dados serão atualizados no sistema.</p>
            </div>
            {payment.name && (
                <PaymentForm
                    handleSubmit={updatePayment}
                    btnText="Atualizar"
                    paymentData={payment}
                />
            )}
        </section>
    )
}

export default ConfigPaymentsEdit;