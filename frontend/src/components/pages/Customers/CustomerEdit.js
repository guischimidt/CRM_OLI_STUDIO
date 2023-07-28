import api from '../../../utils/api';
import { useState, useEffect } from 'react';
import styles from './CustomerAdd.module.css';
import CustomerForm from '../../form/CustomerForm';

//hooks
import useFlashMessage from '../../../hooks/useFlashMessage';
import { useParams, useNavigate } from 'react-router-dom';

function CustomerEdit() {
    const [customer, setCustomer] = useState([]);
    const { id } = useParams();
    const { setFlashMessage } = useFlashMessage();
    const navigate = useNavigate();
    const [token] = useState(localStorage.getItem('token') || '');


    useEffect(() => {
        api.get(`/customers/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            }
        })
            .then((response) => {
                setCustomer(response.data.customer)
            })
    }, [id, token])

    async function updateCustomer(customer) {
        let msgType = "success";

        const data = await api.patch(`customers/edit/${customer._id}`, customer, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            }
        } )
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            msgType = 'error';
            return err.response.data;
        });

        setFlashMessage(data.message, msgType);
        navigate('/customers/');
    }

    return (
        <section>
            <div className={styles.customeradd_header}>
                <h1>Editando {customer.name}</h1>
                <p>Após a edição os dados serão atualizados no sistema.</p>
            </div>
            {customer.name && (
                <CustomerForm
                    handleSubmit={updateCustomer}
                    btnText="Atualizar"
                    customerData={customer}
                />
            )}
        </section>
    )
}

export default CustomerEdit;