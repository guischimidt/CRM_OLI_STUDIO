import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import api from '../../../utils/api';

//Styles
import styles from '../../layout/Container.module.css';


import * as BsIcons from 'react-icons/bs';

//hooks
import useFlashMessage from '../../../hooks/useFlashMessage';

function ConfigProcedures() {
    const navigate = useNavigate();
    const [procedures, setProcedures] = useState([]);
    const { setFlashMessage } = useFlashMessage();

    useEffect(() => {

        api.get('/config/procedures/')
            .then((response) => {
                setProcedures(response.data.procedures);
            });
    }, []);

    async function removeProcedure(id) {
        let msgType = 'success';

        const data = await api.delete(`/config/procedures/${id}`,)
            .then((response) => {
                const updatedProcedures = procedures.filter((procedure) => procedure._id !== id);
                setProcedures(updatedProcedures);
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
                <h1>Procedimentos</h1>
                <button onClick={() => navigate('/config/procedures/add')}>Cadastrar Procedimento</button>
            </div>
            <div className={styles.card_container}>
                {procedures.length > 0 &&
                    procedures.map((procedure) => (
                        <div key={procedure._id} className={styles.card} style={{backgroundColor: procedure.color === 1 ? "#7986cb" 
                        : procedure.color === 2 ? "#33b679"
                        : procedure.color === 3 ? "#8e24aa"
                        : procedure.color === 4 ? "#e67c73"
                        : procedure.color === 5 ? "#f6c026"
                        : procedure.color === 6 ? "#f5511d"
                        : procedure.color === 7 ? "#039be5"
                        : procedure.color === 8 ? "#616161"
                        : procedure.color === 9 ? "#3f51b5"
                        : procedure.color === 10 ? "#0b8043"
                        : procedure.color === 11 ? "#d60000"
                        : ""
                        }}>
                            <h2>{procedure.name}</h2>
                            <p><span>Preço: </span>R$ {JSON.parse(procedure.price.$numberDecimal).toFixed(2).replace('.', ',')}</p>
                            <p><span> Mensagem: </span>{procedure.days_message} dias</p>
                            <p><span> Tempo: </span>{procedure.time} horas</p>
                            <div className={styles.card_actions}>
                                <BsIcons.BsFillPencilFill onClick={() => navigate(`/config/procedures/edit/${procedure._id}`)} />
                                <BsIcons.BsFillTrashFill onClick={() => removeProcedure(procedure._id)} /></div>
                        </div>
                    )
                    )
                }
            </div>
            {procedures.length === 0 && <p>Não há Procedimentos cadastrados</p>}

        </section>
    )
}

export default ConfigProcedures;