import styles from './login.module.css'
import { inputBlur, inputFocus } from './inputActions'
import { useEffect, useReducer, useState, useRef } from 'react'
import Eye from '../../assets/svg/eye'
import EyeOff from '../../assets/svg/EyeOff'
import userImg from '../../assets/img/user.png'
import Camera from '../../assets/svg/camera'



function RegisterForm(props)
{

    const [showPassword,setShowPassword] = useState(false)
    const[previewImg,setPreviewImg] = useState(userImg)
    const [errors,setErrors] = useState({
        name:'',
        email:'',
        password:'',
        repeatPassword:'',
        username:''
    })

    const file = useRef()

    const reducer = (state,action) => {

        const newState = {...state}
        newState[action.type] = action.value
        return newState
    }

    const [values,dispatch] = useReducer(reducer,{
        name:'',
        email:'',
        password:'',
        repeatPassword:'',
        username:''
    })

    const fileChanged = (e) =>
    {
        if(e.target.files[0].type.includes("image"))
        {
            const imgURL = URL.createObjectURL(e.target.files[0])
            setPreviewImg(imgURL)
        }
    }

    const emailRegex = (email) =>
    {
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        return regex.test(email)
    }

    const passwordRegex = (passwd) =>
    {
        const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        return regex.test(passwd)
    }

    const validateData = () => {
        console.log("dfsdf")
        const errors = {
            name:'',
            email:'',
            password:'',
            repeatPassword:'',
            username:''
        }
        setErrors(errors)
        if(!values.name.trim())
        {
            errors.name = `Podaj imię`
        }
        if(!values.email.trim())
        {
            errors.email = `Podaj adres email`
        }
        else if(!emailRegex(values.email))
        {
            errors.email = `Podaj prawidłowy adres`
        }
        if(!values.password)
        {
            errors.password = `Podaj hasło`
        }
        else if(!passwordRegex(values.password))
        {
            errors.password = `Podaj silniejsze hasło`
        }
        if(!values.repeatPassword)
        {
            errors.repeatPassword = `Powtórz hasło`
        }
        else if(values.password != values.repeatPassword)
        {
            errors.repeatPassword = `Hasła nie są identyczne`
        }
        if(!values.username)
        {
            errors.username = `Podaj nazwę`
        }
       
        setErrors(errors)
        if(errors.password || errors.repeatPassword)
        {
            props.setCard(1)
        }
        if(errors.name || errors.email)
        {
            props.setCard(0)
        }
        let validateComplete = true
        for(const key in errors)
        {
            if(errors[key])
            {
                validateComplete = false
            }
        }
        if(validateComplete)
        {
            props.setLoading(true)
            console.log("send")
        }
        else
        {
            props.setRegisterValidation(false)
        }

    }

    useEffect(()=>{
        if(props.registerValidation)
        {
            validateData()
        }
    },[props.registerValidation])

    return(
        <div className={styles.cardSpinner}>
        <div className={`${styles.card} ${props.registerCard === 0?styles.cardPosition2 :( props.registerCard === 1 ? styles.cardPosition1: styles.cardPosition0)}`}>
            <div className={styles.inputContainer} onClick={e=>e.target.classList.contains(styles.inputContainer)?e.target.children[0].focus():null}>
                <input type='text' className={styles.input} disabled={props.loading} onFocus={inputFocus} onBlur={inputBlur} value={values.name} onChange={e=>dispatch({type:'name',value:e.target.value})}></input>
                <h2 className={styles.inputPlaceholder} onClick={e=>e.target.closest('div').children[0].focus()}>
                    Wprowadź Swoje Imię
                </h2>
            </div>

            <div className={styles.error}>{errors.name}</div>

            <div className={styles.inputContainer} onClick={e=>e.target.classList.contains(styles.inputContainer)?e.target.children[0].focus():null}>
                <input type="text" disabled={props.loading} className={styles.input} onFocus={inputFocus} onBlur={inputBlur} value={values.email} onChange={e=>dispatch({type:'email',value:e.target.value})}></input>
                <h2 className={styles.inputPlaceholder} onClick={e=>e.target.closest('div').children[0].focus()}>
                    Podaj swój adres email
                </h2>
            </div>

            <div className={styles.error}>{errors.email}</div>
        </div>
        

        <div className={`${styles.card} ${props.registerCard === 0?styles.cardPosition3 :( props.registerCard === 1 ? styles.cardPosition2: styles.cardPosition1)}`}>
            <div className={styles.inputContainer} onClick={e=>e.target.classList.contains(styles.inputContainer)?e.target.children[0].focus():null}>
                <input type={showPassword?"text":"password"} className={`${styles.input} ${styles.passwordInput}`} disabled={props.loading} onFocus={inputFocus} onBlur={inputBlur} value={values.password} onChange={e=>dispatch({type:'password',value:e.target.value})}></input>
                <h2 className={styles.inputPlaceholder} onClick={e=>e.target.closest('div').children[0].focus()}>
                    Utwórz hasło
                </h2>
                <div className={styles.eye} onClick={e=>!props.loading?setShowPassword(!showPassword):null}>
                {showPassword?<Eye />:<EyeOff />}
                </div>
            </div>

            <div className={styles.error}>{errors.password}</div>

            <div className={styles.inputContainer} onClick={e=>e.target.classList.contains(styles.inputContainer)?e.target.children[0].focus():null}>
                <input type={showPassword?"text":"password"} disabled={props.loading} className={`${styles.input} ${styles.passwordInput}`} onFocus={inputFocus} onBlur={inputBlur} value={values.repeatPassword} onChange={e=>dispatch({type:'repeatPassword',value:e.target.value})}></input>
                <h2 className={styles.inputPlaceholder} onClick={e=>e.target.closest('div').children[0].focus()}>
                    Powtórz hasło
                </h2>
                <div className={styles.eye} onClick={e=>!props.loading?setShowPassword(!showPassword):null}>
                {showPassword?<Eye />:<EyeOff />}
                </div>
            </div>

            <div className={styles.error}>{errors.repeatPassword}</div>
        </div>


        <div className={`${styles.card} ${props.registerCard === 0?styles.cardPosition4 :( props.registerCard === 1 ? styles.cardPosition3: styles.cardPosition2)}`}>
            <div className={styles.fileContainer}>
                <input type='file' ref={file} accept="image/*" className={styles.file} title='' onChange={fileChanged} ></input>
                <img src={previewImg} className={styles.userImg}/>
                <span className={styles.imgTheme}><Camera /></span>
            </div>

            <div className={styles.inputContainer} onClick={e=>e.target.classList.contains(styles.inputContainer)?e.target.children[0].focus():null}>
                <input type="text" disabled={props.loading} className={styles.input} onFocus={inputFocus} onBlur={inputBlur} value={values.username} onChange={e=>dispatch({type:'username',value:e.target.value})}></input>
                <h2 className={styles.inputPlaceholder} onClick={e=>e.target.closest('div').children[0].focus()}>
                    Utwórz nazwę użytkownika
                </h2>
            </div>

            <div className={styles.error}>{errors.username}</div>
        </div>
        </div>
        
    )
}

export default RegisterForm