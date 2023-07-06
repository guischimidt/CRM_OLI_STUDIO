import { useState } from 'react';

import formStyles from './Form.module.css';
import inputStyles from './Input.module.css';
import styles from './CustomerForm.module.css';

import Input from './Input';

//hooks

function PaymentForm({ handleSubmit, paymentData, btnText }) {
    const [payment, setPayment] = useState(paymentData || {});

    function handleChange(e) {
        setPayment({ ...payment, [e.target.name]: e.target.value });
    };

    function submit(e) {
        e.preventDefault();
        handleSubmit(payment);
    }

    return (
        <form onSubmit={submit} className={formStyles.form_container}>
            <Input
                text="Forma de Pagamento"
                type="text"
                name="name"
                placeholder="Digite a forma de pagamento"
                handleOnChange={handleChange}
                value={payment.name || ""}
            />
            <Input
                text="Taxa"
                type="number"
                name="tax"
                placeholder={"Digite a taxa descontada"}
                handleOnChange={handleChange}
                value={payment.tax || ""}
            />
            <input type="submit" value={btnText} />
        </form>
    )

}

export default PaymentForm;