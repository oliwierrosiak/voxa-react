import { useContext, useEffect, useState } from 'react'
import styles from './login.module.css'
import Loading2 from '../../assets/svg/loading2'
import axios from 'axios'
import ApiAddress from '../../ApiAddress'
import setDocumentTitle from '../helpers/useDocumentTitle'
import messageContext from '../context/messageContext'

function PasswordForgotten(props)
{
    let timeout
    const [inputValue,setInputValue] = useState('')
    const [error,setError] = useState('')
    const [done,setDone] = useState(false)

    const message = useContext(messageContext)

    const resetPassword = async()=>{
        try
        {
            timeout = setTimeout(()=>{
                message.setContent('Resetowanie hasła może zająć wiecej czasu ze względu na rozruch serwera','info')
            },5000)
            const response = await axios.post(`${ApiAddress}/password-forgotten`,{email:inputValue})
            clearTimeout(timeout)
            setDone(true)
            props.setLoading(false)
        }
        catch(ex)
        {
            clearTimeout(timeout)
            setDone(true)
            props.setLoading(false)
        }
    }

    const validateData = () =>{
        setError('')
        if(inputValue.trim() !== "")
        {
            props.setLoading(true)
            resetPassword()
        }
        else
        {
            setError("Podaj email")
        }
    }

    const keyDown = (e) =>{
        if(e.key === "Enter")
        {
            validateData()
        }
    }

    useEffect(()=>{
        setDocumentTitle("Resetowanie hasła")

    },[])

    const redirectToRegister = (e) =>
    {
        e.preventDefault()
        props.setLoginAction('register')
    }

    return(
        props.loading?<Loading2 class={styles.passwordForgottenLoading}/>:(done?<div className={styles.resetPasswordDone}>
            <p className={styles.passwordResetDoneP}>Sprawdź swoją skrzynkę odbiorczą na którą wysłano link do resetowania hasła. Jeżeli nie otrzymasz linku oznacza to konto o podanym adresie email nie istnieje w naszym serwisie, ale nic strzasznego, możesz <a href="" onClick={redirectToRegister} className={styles.redirectToRegister}>zarejestrować</a> sie już teraz! Jeżeli otrzymasz link postępuj zgodnie z instrukcjami i zresetuj swoje hasło.</p>
            <button className={styles.resetPassword} onClick={e=>props.setLoginAction('')}>Wróc do strony głównej</button>
        </div>:
        <div className={styles.passwordForgottenContainer}>
            <input onKeyDown={keyDown} className={styles.passwordForgottenInput} placeholder='Podaj swój adres email' value={inputValue} onChange={e=>setInputValue(e.target.value)}></input>
            <div className={styles.passwordForgottenError}>{error}</div>
            <button className={styles.resetPassword} onClick={validateData}>Resetuj hasło</button>
        </div>)
    )
}

export default PasswordForgotten