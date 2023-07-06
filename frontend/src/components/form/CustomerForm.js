import { useState } from 'react';

import formStyles from './Form.module.css';
import inputStyles from './Input.module.css';
import styles from './CustomerForm.module.css';

import Input from './Input';
import TextArea from './TextArea';

//hooks
import useMask from '../../hooks/useMask';

function CustomerForm({ handleSubmit, customerData, btnText }) {

    const [customer, setCustomer] = useState(customerData || {});

    const { maskCPF, maskPhone } = useMask();

    var arrayDay = [];
    for (var i = 1; i <= 31; i++) {
        arrayDay.push(i);
    }

    var arrayYear = [];
    for (i = 1950; i <= 2022; i++) {
        arrayYear.push(i);
    }

    function handleCPF(e) {
        setCustomer({ ...customer, [e.target.name]: maskCPF(e.target.value) });
    }

    function handlePhone(e) {
        setCustomer({ ...customer, [e.target.name]: maskPhone(e.target.value) });
    }

    function handleSelect(e) {
        setCustomer({ ...customer, [e.target.name]: e.target.options[e.target.selectedIndex].value });
    };

    function handleChange(e) {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    function submit(e) {
        e.preventDefault();
        handleSubmit(customer);
    }

    return (
        <form onSubmit={submit} className={formStyles.form_container}>
            <Input
                text="Nome"
                type="text"
                name="name"
                placeholder="Digite o nome da cliente"
                handleOnChange={handleChange}
                value={customer.name || ""}
            />
            <Input
                text="CPF"
                type="text"
                name="cpf"
                placeholder="Digite o CPF da cliente"
                handleOnChange={handleCPF}
                value={customer.cpf || ""}
                readonly={btnText === "Atualizar" ? "readonly" : ""}
            />
            <Input
                text="Telefone"
                type="text"
                name="phone"
                placeholder="Digite o telefone da cliente"
                handleOnChange={handlePhone}
                value={customer.phone || ""}
            />
            <div className={inputStyles.form_control}>
                <label>Data de Nascimento</label>

                <div className={styles.form_control}>
                    <select
                        name="bday"
                        id="bday"
                        onChange={handleSelect}
                        value={customer.bday || ''}
                    >
                        <option>Dia</option>
                        {arrayDay.map((option) => (
                            <option value={option} key={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    <select
                        name="bmonth"
                        id="bmonth"
                        onChange={handleSelect}
                        value={customer.bmonth || ''}
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
                        name="byear"
                        id="byear"
                        onChange={handleSelect}
                        value={customer.byear || ''}
                    >
                        <option>Ano</option>
                        {arrayYear.map((option) => (
                            <option value={option} key={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <TextArea
                text="Observações"
                name="comments"
                handleOnChange={handleChange}
                value={customer.comments || ""}
            >
            </TextArea>

            <input type="submit" value={btnText} />
        </form>
    )

}

export default CustomerForm;