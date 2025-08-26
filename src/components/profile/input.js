import styles from './profile.module.css'
import OkIcon2 from '../../assets/svg/ok2'

function Input(props)
{
    const inputFocused = (e) =>{
        e.target.closest('div').classList.add(styles.inputFocused)
        e.target.closest('div').children[0].classList.add(styles.placeholderWhileInputFocused)
    }
    
    const inputBlur = (e) =>{
        e.target.closest('div').classList.remove(styles.inputFocused)
        e.target.closest('div').children[0].classList.remove(styles.placeholderWhileInputFocused)
        props.checkValue()
    }

    return(
        <div className={`${styles.innerInputContainer} ${props.type === "email"?styles.containerDisabled:""}`} onClick={e=>e.target.classList.contains(styles.innerInputContainer)?e.target.children[1].focus():null}>

            <h2 className={`${styles.placeholder} ${props.type === "email"?styles.headerDisabled:""}`} onClick={e=>e.target.closest('div').children[1].focus()}>{props.type === "name"?"Zmień Imię":props.type === "username"?"Zmień Nazwę Użytkownika":"Twój Adres Email"}</h2>

            <input type='text' disabled={props.type === "email"} className={`${styles.input} ${props.type === "email"?styles.inputDisabled:styles.inputPadding}`} onFocus={inputFocused} onBlur={inputBlur} value={props.value} onChange={e=>props.setValues(e.target.value,props.type)}/>

            {props.type !== "email" &&
            <div className={styles.acceptChanges}>
                <OkIcon2 class={styles.checkMark}/>
            </div>}

        </div>
    )
}

export default Input