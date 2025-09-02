import { useContext, useRef, useState } from 'react'
import SearchIcon from '../../../assets/svg/search'
import styles from '../topBar.module.css'
import Loading2 from '../../../assets/svg/loading2'
import loggedUser from '../../context/loggedUserContext'
import Logout from '../../../assets/svg/logout'
import InvitationsIcon from '../../../assets/svg/invitations'
import ChatIcon from '../../../assets/svg/chat'
import ProfileIcon from '../../../assets/svg/profile'
import { useNavigate } from 'react-router-dom'

function ResponsiveMenu(props)
{
    const navigate = useNavigate()
    const inputRef = useRef()
    const borderFill = useRef()
    const loggedUserContext = useContext(loggedUser)

    const [searchValue,setSearchValue] = useState('')

    const focusInput = (e) =>
    {
        if(inputRef.current && !e.target.closest('button')?.classList.contains(styles.responsiveSearchIcon))
        {
            inputRef.current.focus()
        }
    }

    const inputFocused = () =>
    {
        if(borderFill.current)
        {
            borderFill.current.classList.add(styles.responsiveSearchBorderFilled)
        }
    }

    const inputBlur = () =>
    {
        if(borderFill.current)
        {
            borderFill.current.classList.remove(styles.responsiveSearchBorderFilled)
        }
    }

    const searchFunc = (e) => {
        if(searchValue.trim())
        {
            inputRef.current.blur()
            props.setDisplayResponsiveMenu(false)
            navigate(`/search/${searchValue.trim()}`)
            setSearchValue('')
        }
    }   

    const navigator = (destination) =>
    {
        props.setDisplayResponsiveMenu(false)
        setTimeout(() => {
            navigate(destination)
            
        }, 150);
    }

    return(
        <div className={`${styles.responsiveMenu} ${props.displayResponsiveMenu?styles.responsiveMenuDisplay:''}`}>

            <div className={styles.responsiveSearch} onClick={focusInput}>
                <input ref={inputRef} onFocus={inputFocused} onBlur={inputBlur} className={styles.responsiveSearchBar} type='text' placeholder='Wyszukaj coś...' value={searchValue} onChange={e=>setSearchValue(e.target.value)}/>
                <button className={styles.responsiveSearchIcon} onClick={searchFunc}>
                    <SearchIcon class={styles.responsiveSearchIconSVG}/>
                </button>
                <div className={styles.responsiveSearchBorder} onClick={focusInput}>
                    <div ref={borderFill} className={styles.responsiveSearchBorderFill}></div>
                </div>
            </div>

            <div className={styles.responsiveProfile}>
                <div className={styles.responsiveUserImgContainer}>
                    {props.imgLoading?<Loading2 class={styles.loadingSVG} />:<img src={props.img}/>}
                </div>

                <h2 className={styles.responsiveUsername}>{loggedUserContext.loggedUser.username}</h2>

                <ul className={styles.responsiveList}>
                    <li onClick={e=>navigator('/profile')}><ProfileIcon class={styles.icon2}/>Profil</li>
                    <li  onClick={e=>navigator('/invitations')}><InvitationsIcon class={styles.icon2} />Zaproszenia</li>
                    <li onClick={e=>navigator('/chats')}><ChatIcon class={styles.icon2}/>Czaty</li>
                    <li className={styles.responsiveLogout} onClick={props.logout}><Logout class={styles.logoutIcon2}/>Wyloguj się</li>
                </ul>
            </div>

        </div>
    )
}

export default ResponsiveMenu