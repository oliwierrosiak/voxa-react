import styles from './profile.module.css'
import voxaLogo from '../../assets/img/voxalogo1.png'
import { useContext, useState } from 'react'
import refreshToken from '../helpers/refreshToken'
import Loading2 from '../../assets/svg/loading2'
import axios from 'axios'
import ApiAddress from '../../ApiAddress'
import { useNavigate } from 'react-router-dom'
import messageContext from '../context/messageContext'
import logoutContext from '../context/logoutContext'

function DeleteAccountConfirm(props)
{
    const logout = useContext(logoutContext)
    const navigate = useNavigate()
    const message = useContext(messageContext)
    const [password,setPassword] = useState('')
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)

    const deleteAccount = async()=>{
        try
        {
            setLoading(true)
            await refreshToken()
            const response = await axios.put(`${ApiAddress}/delete-account`,{password:password},{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`}})
            message.setContent('Twoje konto zostało usunięte','info')
            logout.logout()
            navigate('/')
        }
        catch(ex)
        {
            if(ex.status === 401)
            {
                setError("Błędne hasło")
                setLoading(false)
            }
            else
            {
                setError("Wystąpił bład serwera")
                setLoading(false)

            }
        }
    }

    const validate = () =>{
        setError('')
        if(password.trim() === "")
        {
            setError("Podaj hasło")
        }
        else
        {
            deleteAccount()
        }
    }

    return(
        <div className={styles.deleteConfirmContainer}>
            <div className={styles.deleteAccountContainer}>
                <img src={voxaLogo} className={styles.logo}></img>
                {loading?<div className={styles.deleteAccountLoadingContainer}>
                    <Loading2 class={styles.deleteAccountLoading}/>
                    <h2>Trwa usuwanie konta...</h2>
                </div>:<>
                <p>Aby usunąć konto wpisz swoje hasło poniżej. Po kliknięciu "Potwierdź" proces ten będzie <mark>nieodwracalny!</mark></p>
                <input type='password' placeholder='Podaj swoje hasło' className={styles.passwordInput} value={password} onChange={e=>setPassword(e.target.value)}></input>
                <div className={styles.error}>
                    {error}
                </div>
                <div className={styles.btnContainer}>
                    <button className={styles.cancel} onClick={e=>props.setDeleteAccountConfirm(false)}>Anuluj</button>
                    <button className={styles.accept} onClick={validate}>Potwierdź</button>
                </div>
                </>}
            </div>
        </div>
    )
}

export default DeleteAccountConfirm