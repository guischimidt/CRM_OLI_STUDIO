import api from '../../../utils/api'

import styles from './ScheduleAdd.module.css';

import { useNavigate, useParams } from 'react-router-dom';

//Components 
import ScheduleForm from '../../form/ScheduleForm';

//hooks
import useFlashMessage from '../../../hooks/useFlashMessage';


function ScheduleAdd() {
    const { id } = useParams();
    const { setFlashMessage } = useFlashMessage();
    const navigate = useNavigate();
    
    async function addSchedule([customer, selected, schedule]) {
        let msgType = "success";
       // console.log(selected);

        const data = await api.post('schedules/create', [customer, selected, schedule])
            .then((response) => {
                return response.data;
            })
            .catch((err) => {
                msgType = 'error';
                return err.response.data;
            });

        setFlashMessage(data.message, msgType);

        if (msgType !== 'error') {
            navigate('/schedule');
        }
    };

    return (
        <section >
            <div className={styles.scheduleadd_header}>
                <h1>Agendando Procedimento</h1>
            </div>
            <ScheduleForm id={id} handleSubmit={addSchedule} btnText="Agendar" />
        </section>
    );
};

export default ScheduleAdd;