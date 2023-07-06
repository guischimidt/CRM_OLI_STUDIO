import api from '../../utils/api'

import Multiselect from 'multiselect-react-dropdown';

import { useState, useEffect } from 'react';

import formStyles from './Form.module.css';
import inputStyles from './Input.module.css';
import styles from './CustomerForm.module.css';

import Input from './Input';
import TextArea from './TextArea';
//hooks
//import useMask from '../../hooks/useMask';

function ScheduleForm({ handleSubmit, id, scheduleData, btnText }) {

    const [schedule, setSchedule] = useState(scheduleData || {});
    const [customer, setCustomer] = useState({});
    const [selected, setSelected] = useState([]);
    const [procedure, setProcedure] = useState([]);

    useEffect(() => {
        api.get(`/customers/${id}`,)
            .then((response) => {
                setCustomer(response.data.customer)
            })
    }, [id])

    useEffect(() => {
        api.get(`/config/procedures`,)
            .then((response) => {
                setProcedure(response.data.procedures)
            })
    }, [])
    //const { maskCPF, maskPhone } = useMask();

    let arrayDay = [];
    for (let i = 1; i <= 31; i++) {
        arrayDay.push(i);
    }

    let arrayHour = [];
    for (let i = 7; i <= 20; i++) {
        arrayHour.push(i);
    }

    const actualYear = new Date().getFullYear();
    const nextYear = actualYear + 1;

    useEffect(() => {
        setSchedule({ year: JSON.stringify(actualYear) });
    }, [])


    function handleSelect(e) {
        setSchedule({ ...schedule, [e.target.name]: e.target.options[e.target.selectedIndex].value });
    };

    function handleSelected(data) {
        setSelected(data);
    };

    function handleChange(e) {
        setSchedule({ ...schedule, [e.target.name]: e.target.value });
    };

    function submit(e) {
        e.preventDefault();
        handleSubmit([customer, selected, schedule]);
    }
    
    return (
        <form onSubmit={submit} className={formStyles.form_container}>
            <Input
                text="Cliente"
                type="text"
                name="name"
                value={customer.name}
                readOnly
            />
            <div className={inputStyles.form_control}>
                <label>Procedimentos</label>

                <Multiselect
                    style={{
                        chips: {
                            background: '#d43f85'
                        },
                        inputField: {
                            width: '100%'
                        },
                        searchBox: {
                            border: '1px solid #777'
                        },
                        multiselectContainer: {

                        }

                    }}
                    placeholder="Selecione os procedimentos"
                    options={procedure} // Options to display in the dropdown
                    selectedValues={selected}
                    value={selected} // Preselected value to persist in dropdown
                    onSelect={handleSelected}
                    onRemove={handleSelected} // Function will trigger on select event
                    displayValue="name" // Property name to display in the dropdown options
                />

            </div>
            <div className={inputStyles.form_control}>
                <label>Data do Agendamento</label>

                <div className={styles.form_control}>
                    <select
                        name="day"
                        id="day"
                        onChange={handleSelect}
                        value={schedule.day || ''}
                    >
                        <option>Dia</option>
                        {arrayDay.map((option) => (
                            <option value={option} key={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    <select
                        name="month"
                        id="month"
                        onChange={handleSelect}
                        value={schedule.month || ''}
                    >
                        <option>Mês</option>
                        <option value='1' key='1'>Janeiro</option>
                        <option value='2' key='2'>Fevereiro</option>
                        <option value='3' key='3'>Março</option>
                        <option value='4' key='4'>Abril</option>
                        <option value='5' key='5'>Maio</option>
                        <option value='6' key='6'>Junho</option>
                        <option value='7' key='7'>Julho</option>
                        <option value='8' key='8'>Agosto</option>
                        <option value='9' key='9'>Setembro</option>
                        <option value='10' key='10'>Outubro</option>
                        <option value='11' key='11'>Novembro</option>
                        <option value='12' key='12'>Dezembro</option>
                    </select>
                    <select
                        name="year"
                        id="year"
                        onChange={handleSelect}
                        value={schedule.year || ""}
                    >
                        <option value={actualYear} key={actualYear}>{actualYear}</option>
                        <option value={nextYear} key={nextYear}>{nextYear}</option>
                    </select>
                </div>


            </div>

            <div className={inputStyles.form_control}>
                <label>Horário do Agendamento</label>

                <div className={styles.form_control}>
                    <select
                        name="hour"
                        id="hour"
                        onChange={handleSelect}
                        value={schedule.hour || ''}
                    >
                        <option>Hora</option>
                        {arrayHour.map((option) => (
                            <option value={option} key={option}>
                                {option}
                            </option>
                        ))}
                    </select>

                    <select
                        name="minute"
                        id="minute"
                        onChange={handleSelect}
                        value={schedule.minute || ''}
                    >
                        <option>Minuto</option>
                        <option value='00' key='1'>00</option>
                        <option value='05' key='2'>05</option>
                        <option value='10' key='3'>10</option>
                        <option value='15' key='4'>15</option>
                        <option value='20' key='5'>20</option>
                        <option value='25' key='6'>25</option>
                        <option value='30' key='7'>30</option>
                        <option value='35' key='8'>35</option>
                        <option value='40' key='9'>40</option>
                        <option value='45' key='10'>45</option>
                        <option value='50' key='11'>50</option>
                        <option value='55' key='12'>55</option>
                    </select>

                </div>


            </div>
            <TextArea
                text="Observações"
                name="comments"
                handleOnChange={handleChange}
                value={schedule.comments || ""}
            >
            </TextArea>

            <input type="submit" value={btnText} />
        </form>
    )

}

export default ScheduleForm;