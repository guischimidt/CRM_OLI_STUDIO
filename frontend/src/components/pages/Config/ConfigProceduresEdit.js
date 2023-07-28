import api from '../../../utils/api';
import { useState, useEffect } from 'react';
import styles from './ConfigProceduresAdd.module.css';
import ProcedureForm from '../../form/ProcedureForm';

//hooks
import useFlashMessage from '../../../hooks/useFlashMessage';
import { useParams, useNavigate } from 'react-router-dom';

function ConfigProceduresEdit() {
    const [procedure, setProcedure] = useState([]);
    const { id } = useParams();
    const { setFlashMessage } = useFlashMessage();
    const navigate = useNavigate();
    const [token] = useState(localStorage.getItem('token') || '');


    useEffect(() => {
        api.get(`/config/procedures/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            }
        } )
            .then((response) => {
                setProcedure(response.data.procedure)
            })
    }, [id, token])

    async function updateProcedure(procedure) {
        let msgType = "success";

        const data = await api.patch(`config/procedures/${procedure._id}`, procedure, {
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
        navigate('/config/procedures');
    }

    return (
        <section>
            <div className={styles.proceduresadd_header}>
                <h1>Editando {procedure.name}</h1>
                <p>Após a edição os dados serão atualizados no sistema.</p>
            </div>
            {procedure.name && (
                <ProcedureForm
                    handleSubmit={updateProcedure}
                    btnText="Atualizar"
                    procedureData={procedure}
                />
            )}
        </section>
    )
}

export default ConfigProceduresEdit;