import { useState, useEffect } from 'react';

import Moment from 'moment';

import api from '../../../utils/api';

//Styles
import styles from '../../layout/Container.module.css';
import tableStyle from '../../layout/Table.module.css';
import * as BsIcons from 'react-icons/bs';


function CustomerMessages() {
    const [schedules, setSchedules] = useState([]);
    const [filter, setFilter] = useState({ name: "" });
    const [status, setStatus] = useState("Todos");

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

    function handleChange(e) {
        setStatus(e);
    };

    function handleFilter(e) {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    //Filtrar por status ou nome
    useEffect(() => {
        api.get(`/schedules/${filter.name}`)
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
    }, [status, filter]);

    return (
        <section>
            <div className={styles.container_header}>
                <h1>Lista de Mensagens</h1>
                <button onClick={() => handleChange("Todos")}>Todos</button>
                <button onClick={() => handleChange("Pendentes")}>Pendente</button>
                <button onClick={() => handleChange("Concluídos")}>Concluído</button>
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
            </div>

            <table className={tableStyle.table}>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Procedimento</th>
                        <th>Cliente</th>
                        <th>Lemb.</th>
                        <th>Manut.</th>
                    </tr>
                </thead>
                <tbody>
                    {schedules.length > 0 &&
                        schedules.map((schedule) => (
                            schedule.status !== "Cancelado" && schedule.procedures[0].days_message > 0 ?
                                (<tr key={schedule._id} style={
                                    {
                                        backgroundColor: schedule.status === "Criado" ? "#fff8db"
                                            : schedule.status === "Pago" ? "#ceffb2"
                                                : schedule.status === "Cancelado" ? "#ffb2b2"
                                                    : schedule.status === "Remarcado" ? "#b2dbff"
                                                        : ""
                                    }
                                }>
                                    <td>{Moment(`${schedule.startTime}`).format('DD/MM')}</td>

                                    <td>{schedule.name.split("(")[0].substr(0, 40)}</td>
                                    <td>{schedule.customer.name}</td>
                                    <td>{schedule.remember_message ? <BsIcons.BsCheckCircleFill style={{ cursor: "auto", color: "#20b920", marginLeft: "0.5em" }} /> : ""}</td>
                                    <td>{Moment(`${schedule.startTime}`).add(schedule.procedures[0].days_message, 'days').format("DD/MM")}
                                        {schedule.reschedule_message ? <BsIcons.BsCheckCircleFill style={{ cursor: "auto", color: "#20b920", marginLeft: "0.5em" }} /> : ""}
                                    </td>
                                    {schedules.length === 0 && <td>Nenhum resultado encontrado</td>}
                                </tr>)
                                : ""
                        ))
                    }
                </tbody>
            </table>
        </section>
    )
}

export default CustomerMessages;