//import styles from '../layout/Container.module.css';
import crm from './Home.module.css';
import * as BsIcons from 'react-icons/bs';
import { useEffect } from 'react';
import { useState } from 'react';
import api from '../../utils/api';

function Home() {
    const [count, setCount] = useState(0);
    const [token] = useState(localStorage.getItem('token') || '');

    useEffect(() => {

        api.get('/customers/count', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            }
        })
            .then((response) => {
                setCount(response.data.count);
            });

    }, [token]);

    return (
        <section>
            <div className={crm.card_container}>
                <div className={crm.card}>
                    <h2>Clientes Cadastradas</h2>
                    <BsIcons.BsFillPeopleFill />
                    <span>{count}</span>
                </div>
                <div className={crm.card}>
                <h2>Total Bruto (R$)</h2>
                    <BsIcons.BsCashCoin />
                    <span className={crm.money}>155.800,00</span>
                </div>
                <div className={crm.card}>
                <h2>Total Líquido (R$)</h2>
                    <BsIcons.BsCashStack />
                    <span className={crm.money}>10.800,00</span>
                </div>
            </div>
        </section>

    );
};

export default Home;