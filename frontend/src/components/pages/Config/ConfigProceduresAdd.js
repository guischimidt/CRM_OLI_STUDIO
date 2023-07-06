import api from '../../../utils/api'

import styles from './ConfigProceduresAdd.module.css';

import { useNavigate } from 'react-router-dom';

//Components 
import ProcedureForm from '../../form/ProcedureForm';

//hooks
import useFlashMessage from '../../../hooks/useFlashMessage';

function ConfigProceduresAdd() {
    const { setFlashMessage } = useFlashMessage();
    const navigate = useNavigate();

    async function registerProcedure(procedure) {
        let msgType = "success";

        const data = await api.post('config/procedures/create', procedure,)
            .then((response) => {
                return response.data;
            })
            .catch((err) => {
                msgType = 'error';
                return err.response.data;
            });

        setFlashMessage(data.message, msgType);

        if (msgType !== 'error') {
            navigate('/config/procedures');
        }
    };

    return (
        <section className={styles.proceduresadd_header}>
            <div >
                <h1>Cadastro de Procedimentos</h1>
            </div>
            <ProcedureForm handleSubmit={registerProcedure} btnText="Cadastrar" />
        </section>
    );
};

export default ConfigProceduresAdd;