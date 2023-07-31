import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import Moment from 'moment';
import Modal from 'react-modal';

import Input from '../../form/Input';

import api from '../../../utils/api';

//Styles
import styles from '../../layout/Container.module.css';
import tableStyle from '../../layout/Table.module.css';
import formStyles from '../../form/Form.module.css';
import inputStyles from '../../form/Input.module.css';

import * as BsIcons from 'react-icons/bs';

//hooks
import useFlashMessage from '../../../hooks/useFlashMessage';

function Schedules() {
    const navigate = useNavigate();
    const [schedules, setSchedules] = useState([]);
    const [payments, setPayments] = useState([]);
    const [payment, setPayment] = useState({});
    const [filter, setFilter] = useState({ name: "" });
    const { setFlashMessage } = useFlashMessage();
    const [schedule, setSchedule] = useState({});
    const cancelStatus = { cancelStatus: "Cancelado" };
    const [price, setPrice] = useState("");
    const [status, setStatus] = useState("Todos");
    const [modalIsOpen, setIsOpen] = useState(false);
    const [paidIsOpen, SetPaidIsOpen] = useState(false);
    const [scheduleId, setScheduleId] = useState("");
    const [reschedule, setReschedule] = useState(false);
    const [modalPayment, setModalPayment] = useState(false);
    const [customer, setCustomer] = useState({});

    const [token] = useState(localStorage.getItem('token') || '');

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            border: '1px solid #777',
            borderRadius: '5px',
        },
    };

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
    }, [actualYear]);

    function handleSelect(e) {
        setSchedule({ ...schedule, [e.target.name]: e.target.options[e.target.selectedIndex].value });
    };

    function handleSelectPayment(e) {
        setPayment({ ...payment, [e.target.name]: e.target.options[e.target.selectedIndex].value });
    };

    function closeModal() {
        setIsOpen(false);
    }

    function handleChange(e) {
        setStatus(e);
    };

    function handlePaid(e) {
        setPayment({ ...payment, [e.target.name]: e.target.value });
    };

    function handleFilter(e) {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    //Abrir modal para Reagendamento
    function openModalReschedule(data) {
        setIsOpen(true);
        setScheduleId(data);
        setReschedule(true);
        setModalPayment(false);
    }

    //Abrir modal para realizar recebimento
    let procedures = "";
    let procedurePrice = 0;

    function openModalPayment([id, data, dataCustomer, last_visit]) {
        setIsOpen(true);
        setScheduleId(id);
        setReschedule(false);
        setModalPayment(true);

        procedures = data;
        procedures.map((procedure) => (
            procedurePrice = JSON.parse(procedure.price.$numberDecimal) + procedurePrice
        ));
        setCustomer({ ...customer, _id: dataCustomer, price: procedurePrice, last_visit: last_visit });
        setPrice(procedurePrice);
    }

    //Exibir campo para segunda forma de pagamento
    useEffect(() => {
        if (payment.paid < price)
            SetPaidIsOpen(true);
        else {
            SetPaidIsOpen(false);
            if (payment.paid2 !== 0)
                setPayment({ ...payment, paid2: 0, name2: "" });
        }
    }, [payment, price]);

    //Atualizar algum dado do agendamento
    async function update(e) {
        e.preventDefault();
        let msgType = "";
        // let updateCustomer = "";

        const data = await api.patch(`schedules/${scheduleId}`, { schedule, payment }, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            }
        })
            .then((response) => {
                msgType = "success";
                return response.data;
            })
            .catch((err) => {
                msgType = 'error';
                return err.response.data;
            });

        if (payment && customer._id !== "" && msgType === "success") {
            await api.patch(`customers/edit/${customer._id}`, customer, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,
                }
            })
                .then((response) => {
                    return response;
                })
                .catch((err) => {
                    return err.response;
                });

        }

        setFlashMessage(data.message, msgType);
        setStatus("Atualizado");
        setSchedule("");
        setPayment({});
        setScheduleId("");
        closeModal();
        navigate('/schedule');

    };

    //Cancelar agendamento
    async function cancelSchedule(id) {
        let msgType = "success";


        const data = await api.patch(`schedules/${id}`, cancelStatus, {
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
        setStatus("Agendamento Cancelado");
        navigate('/schedule');
    };

    //Filtrar por status ou nome
    useEffect(() => {
        api.get(`/schedules/${filter.name}`,
        {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            }
        })
            .then((response) => {
                setSchedules(response.data.schedules);

                if (status === "Pendentes") {
                    const filterSchedules = schedules.filter((schedule) =>
                        schedule.status === "Criado" ||
                        schedule.status === "Remarcado"
                    );
                    setSchedules(filterSchedules);
                    return response.data;
                }
                else if (status === "Concluídos") {
                    const filterSchedules = schedules.filter((schedule) =>
                        schedule.status === "Pago"
                    );
                    setSchedules(filterSchedules);
                    return response.data;
                }
                else if (status === "Cancelados") {
                    const filterSchedules = schedules.filter((schedule) =>
                        schedule.status === "Cancelado"
                    );
                    setSchedules(filterSchedules);
                    return response.data;
                }

                if (filter.date2) {
                    let date2 = filter.date2;
                    date2 = date2 + "T23:59:59.000";

                    const filterSchedules = schedules.filter((schedule) =>
                        schedule.startTime <= date2
                    );
                    setSchedules(filterSchedules);
                    return response.data;
                }

                if (filter.date1) {
                    const filterSchedules = schedules.filter((schedule) =>
                        schedule.startTime >= filter.date1
                    );
                    setSchedules(filterSchedules);
                    return response.data;
                }



            });
              // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, filter, token]);

    useEffect(() => {
        api.get('config/payments', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            }
        })
            .then((response) => {
                setPayments(response.data.payments);
            })
    }, [token])

    return (
        <section>
            <Modal
                isOpen={modalIsOpen}
                appElement={document.getElementById('root')}
                //onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
            //contentLabel="Example Modal"
            >
                {reschedule ? <form onSubmit={update} className={formStyles.form_container}>
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
                    <input type="submit" value="Reagendar" />
                </form> : modalPayment ? <form onSubmit={update} className={formStyles.form_container}>
                    <div className={inputStyles.form_control} style={{ flexDirection: "row", marginBottom: ".5em", display: "flex", justifyContent: "flex-start" }}>
                        <label>Valor a receber</label><span>: R$ {price.toFixed(2).replace('.', ',')}</span>
                    </div>

                    <div className={inputStyles.form_control}>
                        <label>Forma de Pagamento</label>
                        <div className={styles.form_control}>
                            <select
                                name="name"
                                id="name"
                                onChange={handleSelectPayment}
                                defaultValue={payment.name}
                                value={payment.name || ''}
                            >
                                <option>Forma de Pagamento</option>
                                {payments.map((option) => (
                                    <option value={option.name} key={option._id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <Input
                        text="Valor Pago"
                        type="number"
                        name="paid"
                        placeholder="Digite o valor pago"
                        handleOnChange={handlePaid}
                        value={payment.paid || ""}

                    />

                    <div style={{ display: paidIsOpen ? "" : "none" }} className={inputStyles.form_control}>
                        <label>2ª Forma de Pagamento</label>
                        <div className={styles.form_control}>
                            <select
                                name="name2"
                                id="name2"
                                onChange={handleSelectPayment}
                                defaultValue={payment.name2}
                                value={payment.name2 || ''}
                            >
                                <option>Forma de Pagamento</option>
                                {payments.map((option) => (
                                    <option value={option.name} key={option._id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: paidIsOpen ? "" : "none" }} className={inputStyles.form_control}>
                        <label htmlFor="paid2">2º Valor Pago</label>
                        <input
                            type="number"
                            name="paid2"
                            id="paid2"
                            placeholder="Digite o Valor Pago"
                            onChange={handlePaid}
                            value={payment.paid2 || ""}
                        />

                    </div>

                    <input type="submit" value="Receber" />
                </form> : ""}
            </Modal>

            <div className={styles.container_header}>
                <h1>Agendamentos</h1>
                <button onClick={() => handleChange("Todos")}>Todos</button>
                <button onClick={() => handleChange("Pendentes")}>Pendente</button>
                <button onClick={() => handleChange("Concluídos")}>Concluído</button>
                <button onClick={() => handleChange("Cancelados")}>Cancelado</button>
            </div>

            <div className={styles.form_container}>
                <div className={styles.item_container}>
                    <label htmlFor='name'>Nome</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Digite o nome da cliente"
                        onChange={handleFilter}
                        value={filter.name || ""}
                    />
                </div>
                <div className={styles.item_container}>
                    <label htmlFor='Período'>Período</label>
                    <input
                        type="date"
                        name="date1"
                        onChange={handleFilter}
                        value={filter.date1 || ""}
                    />
                    <input
                        type="date"
                        name="date2"
                        onChange={handleFilter}
                        value={filter.date2 || ""}
                    />
                </div>
            </div>

            <div className={styles.container_label}>
                <span className={styles.square_yellow}></span> Pendente
                <span className={styles.square_blue}></span> Remarcado
                <span className={styles.square_green}></span> Pago
                <span className={styles.square_red}></span> Cancelado
            </div>

            <table className={tableStyle.table}>
                <thead>
                    <tr>
                        <th>Procedimento</th>
                        <th>Cliente</th>
                        <th>Data</th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {schedules.length > 0 &&
                        schedules.map((schedule) => (
                            <tr key={schedule._id} style={
                                {
                                    backgroundColor: schedule.status === "Criado" ? "#fff8db"
                                        : schedule.status === "Pago" ? "#ceffb2"
                                            : schedule.status === "Cancelado" ? "#ffb2b2"
                                                : schedule.status === "Remarcado" ? "#b2dbff"
                                                    : ""
                                }
                            }>
                                <td>{schedule.name.split("(")[0]}</td>
                                <td>{schedule.customer.name}</td>
                                <td>{Moment(`${schedule.startTime}`).add(3, 'hours').format('DD/MM/YYYY HH:mm')}</td>
                                {schedule.status === "Criado" || schedule.status === "Remarcado"
                                    ? <>
                                        <td><BsIcons.BsFillClockFill onClick={() => openModalReschedule(schedule._id)} /></td>
                                        <td><BsIcons.BsFillXCircleFill onClick={() => cancelSchedule(schedule._id)} style={{ color: "#FF2424" }} /></td>
                                        <td> <BsIcons.BsFillCheckCircleFill style={{ color: "#20b920" }} onClick={() => openModalPayment([schedule._id, schedule.procedures, schedule.customer._id, schedule.startTime])} /></td>
                                    </> : <><td></td><td></td><td></td></>}
                                {schedules.length === 0 && <td>Nenhum resultado encontrado</td>}
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </section>
    )
}

export default Schedules;