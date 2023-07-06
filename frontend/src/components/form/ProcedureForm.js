import { useState } from 'react';

import formStyles from './Form.module.css';
import inputStyles from './Input.module.css';
import styles from './CustomerForm.module.css';

import Input from './Input';

//hooks

function ProcedureForm({ handleSubmit, procedureData, btnText }) {
    const [procedure, setProcedure] = useState(procedureData || {});
    const [optionColor, setOptionColor] = useState();

    function handleChange(e) {
        setProcedure({ ...procedure, [e.target.name]: e.target.value });
    };

    function handleSelect(e) {
        setProcedure({ ...procedure, [e.target.name]: e.target.options[e.target.selectedIndex].value });
    };

    function submit(e) {
        e.preventDefault();
        handleSubmit(procedure);
    }

    return (
        <form onSubmit={submit} className={formStyles.form_container}>
            <Input
                text="Procedimento"
                type="text"
                name="name"
                placeholder="Digite o nome do procedimento"
                handleOnChange={handleChange}
                value={procedure.name || ""}
            />
            <Input
                text="Preço"
                type="number"
                name="price"
                placeholder={procedure.price ? procedure.price.$numberDecimal : "Digite o preço do procedimento"}
                handleOnChange={handleChange}
                value={procedure.price || ""}
            />
            <Input
                text="Prazo Mensagem"
                type="number"
                name="days_message"
                placeholder="Digite o prazo para enviar mensagem para a cliente"
                handleOnChange={handleChange}
                value={procedure.days_message || ""}
            />
            <Input
                text="Duração do Procedimento"
                type="text"
                name="time"
                placeholder="Tempo do procedimento (HH:MM)"
                handleOnChange={handleChange}
                value={procedure.time || ""} 
            />
            <div className={inputStyles.form_control}>
                <label>Cor de Exibição</label>

                <div className={styles.form_control}>
                    <select
                        name="color"
                        id="color"
                        onChange={handleSelect}
                        value={procedure.color || ''}
                    >
                        <option>Selecione a cor</option>
                        <option style={{ backgroundColor: "#7986cb", color: "#fff" }} value='1' key='1'>Lavanda</option>
                        <option style={{ backgroundColor: "#33b679", color: "#fff" }} value='2' key='2'>Sálvia</option>
                        <option style={{ backgroundColor: "#8e24aa", color: "#fff" }} value='3' key='3'>Uva</option>
                        <option style={{ backgroundColor: "#e67c73", color: "#fff" }} value='4' key='4'>Flamingo</option>
                        <option style={{ backgroundColor: "#f6c026", color: "#fff" }} value='5' key='5'>Banana</option>
                        <option style={{ backgroundColor: "#f5511d", color: "#fff" }} value='6' key='6'>Tangerina</option>
                        <option style={{ backgroundColor: "#039be5", color: "#fff" }} value='7' key='7'>Pavão</option>
                        <option style={{ backgroundColor: "#616161", color: "#fff" }} value='8' key='8'>Grafite</option>
                        <option style={{ backgroundColor: "#3f51b5", color: "#fff" }} value='9' key='9'>Mirtilo</option>
                        <option style={{ backgroundColor: "#0b8043", color: "#fff" }} value='10' key='10'>Manjericão</option>
                        <option style={{ backgroundColor: "#d60000", color: "#fff" }} value='11' key='11'>Tomate</option>
                    </select>
                </div>
            </div>
            <input type="submit" value={btnText} />
        </form>
    )

}

export default ProcedureForm;