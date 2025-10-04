import styles from './resetPassword.module.css'
import voxaLogo from '../../assets/img/voxalogo1.png'
import { useContext, useEffect, useState } from 'react'
import Eye from '../../assets/svg/eye'
import EyeOff from '../../assets/svg/EyeOff'
import Loading1 from '../../assets/svg/loading1'
import Loading2 from '../../assets/svg/loading2'
import axios from 'axios'
import ApiAddress from '../../ApiAddress'
import { useNavigate, useParams } from 'react-router-dom'
import messageContext from '../context/messageContext'
import setDocumentTitle from '../helpers/useDocumentTitle'

function ResetPassword(props)
{
    const navigate = useNavigate()
    const params = useParams()
    const message = useContext(messageContext)
    const [loading,setLoading] = useState(true)
    const [showPassword,setShowPassword] = useState(false)
    const [password,setPassword] = useState('')
    const [repeatPassword,setRepeatPassword] = useState('')
    const [errors,setErrors] = useState({
        password:'',
        repeatPassword:'',
    })
    const [sendLoading,setSendLoading] = useState(false)
    let timeout

    const verifyToken = async() =>
    {
        try
        {
            timeout = setTimeout(()=>{
                message.setContent('Resetowanie hasła może zająć wiecej czasu ze względu na rozruch serwera','info')
            },5000)
            const response = await axios.get(`${ApiAddress}/reset-password-token/${params.token}`)
            clearTimeout(timeout)
            setLoading(false)
        }
        catch(ex)
        {
            clearTimeout(timeout)
            if(ex.status === 401)
            {
                message.setContent('Twoja sesja resetowania hasła wygasła','error')
                navigate('/')
            }
            else
            {
                message.setContent('Wystąpił błąd serwera przy resetowaniu hasła','error')
                navigate('/')
            }
        }
    }

    const resetPassword = async() =>{
        try
        {
            setSendLoading(true)
            const response = await axios.post(`${ApiAddress}/reset-password`,{password:password,token:params.token})
            message.setContent('Twoje hasło zostało zresetowane',"info")
            navigate('/')
            props.setShowLoginState('login')
        }
        catch(ex)
        {
            if(ex.response?.data.message)
            {
                setErrors({
                    password:'',
                    repeatPassword:ex.response.data.message
                })
                setSendLoading(false)
            }
            else
            {
                message.setContent('Bład resetowania hasła',"error")
                setSendLoading(false)
            }
        }
    }

    const validateData = (e) =>
    {
        e.preventDefault()
        if(sendLoading)
        {
            return
        }

        setErrors({
            password:'',
            repeatPassword:'',
        })
        const errors = {
            password:'',
            repeatPassword:'',
        }
        if(password.trim() === '')
        {
            errors.password = 'Podaj hasło'
        }
        if(repeatPassword.trim() === "")
        {
            errors.repeatPassword = "Powtórz hasło"
        }
        else if(repeatPassword != password)
        {
            errors.repeatPassword = "Hasła nie są identyczne"
        }

        if(!errors.password && !errors.repeatPassword)
        {
            resetPassword()
        }
        
        
        setErrors(errors)
    }

    useEffect(()=>{
        setDocumentTitle("Resetowanie hasła")
        verifyToken()
    },[])

    return(
        <div className={styles.background}>
            <div className={styles.container}>
                
                <img src={voxaLogo}  className={styles.logo}/>
                {loading?<Loading2 class={styles.loading}/>:
                <form className={styles.form} onSubmit={validateData}>
                    <div className={styles.inputContainer}>
                        <input disabled={sendLoading} value={password} onChange={e=>setPassword(e.target.value)} type={showPassword?"text":"password"} placeholder='Nowe hasło' className={styles.input} />
                        <div className={styles.showPassword} onClick={e=>setShowPassword(!showPassword)}>
                            {showPassword?<Eye />:<EyeOff />}
                        </div>
                    </div>
                    <div className={styles.error}>{errors.password}</div>
                    <div className={styles.inputContainer}>
                        <input disabled={sendLoading} value={repeatPassword} onChange={e=>setRepeatPassword(e.target.value)} type={showPassword?"text":"password"} placeholder='Powtórz hasło' className={styles.input} />
                        <div className={styles.showPassword} onClick={e=>setShowPassword(!showPassword)}>
                            {showPassword?<Eye />:<EyeOff />}
                        </div>
                    </div>
                    <div className={styles.error}>{errors.repeatPassword}</div>
                    <button className={styles.resetBtn}>{sendLoading?<Loading1 class={styles.sendLoading}/>:"Resetuj hasło"}</button>
                </form>}
            </div>
        </div>
    )
}

export default ResetPassword