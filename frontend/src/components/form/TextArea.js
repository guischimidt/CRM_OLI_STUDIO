import styles from './TextArea.module.css';

function TextArea({
    type,
    text,
    name,
    placeholder,
    handleOnChange,
    value,
    multiple,
}) {
    return (
        <div className={styles.form_control}>
            <label htmlFor={name}>{text}</label>
            <textarea 
            name={name}
            id={name}
            onChange = {handleOnChange}
            value={value}
            >{value}</textarea>
        </div>
    )
}

export default TextArea;