import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import api from '../../../utils/api';

//Styles
import styles from '../../layout/Container.module.css';
import tableStyle from '../../layout/Table.module.css';



import * as BsIcons from 'react-icons/bs';

//hooks
import useFlashMessage from '../../../hooks/useFlashMessage';

function ConfigPayments() {
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const { setFlashMessage } = useFlashMessage();
    const [token] = useState(localStorage.getItem('token') || '');

    useEffect(() => {

        api.get('/config/payments/', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            }
        })
            .then((response) => {
                setPayments(response.data.payments);
            });
    }, [token]);

    async function removePayment(id) {
        let msgType = 'success';

        const data = await api.delete(`/config/payments/${id}`,{
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            }
        })
            .then((response) => {
                const updatedPayments = payments.filter((payment) => payment._id !== id);
                setPayments(updatedPayments);
                return response.data;
            })
            .catch((err) => {
                msgType = 'error';
                return err.response.data;
            })

        setFlashMessage(data.message, msgType);

    }

    return (
        <section >
            <div className={styles.container_header}>
                <h1>Formas de Pagamento</h1>
                <button onClick={() => navigate('/config/payments/add')}>Adicionar Forma</button>
            </div>
            <table className={tableStyle.table}>
                <thead>
                    <tr>
                        <th>Forma de Pagamento</th>
                        <th>Taxa</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {payments.length > 0 &&
                        payments.map((payment) => (
                            <tr key={payment._id}>
                                <td>{payment.name}</td>
                                <td>{payment.tax}%</td>
                                <td><BsIcons.BsFillPencilFill onClick={() => navigate(`edit/${payment._id}`)} /></td>
                                <td><BsIcons.BsFillTrashFill onClick={() => removePayment(payment._id)} /></td>
                            </tr>
                        ))
                    }
                </tbody></table>
            {payments.length === 0 && <p>Não há formas de pagamentos cadastradas</p>}

        </section>
    )
}

export default ConfigPayments;