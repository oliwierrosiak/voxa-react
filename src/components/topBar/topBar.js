import styles from './topBar.module.css'
import voxaLogo from '../../assets/img/voxalogo1.png'
import { useContext, useEffect, useRef, useState } from 'react'
import Cancel from '../../assets/svg/cancel'
import SearchIcon from '../../assets/svg/search'
import Bell from '../../assets/svg/bell'
import Loading2 from '../../assets/svg/loading2'
import axios from 'axios'
import ApiAddress from '../../ApiAddress'
import refreshToken from '../helpers/refreshToken'
import defaultImg from '../../assets/img/default.jpg'
import loggedUser from '../context/loggedUserContext'
import Logout from '../../assets/svg/logout'
import ProfileIcon from '../../assets/svg/profile'
import InvitationsIcon from '../../assets/svg/invitations'
import ChatIcon from '../../assets/svg/chat'
import LoginContext from '../context/loginContext'
import { useNavigate } from 'react-router-dom'

function TopBar()
{
    const loggedUserContext = useContext(loggedUser)
    const loggedContext = useContext(LoginContext)

    const navigate = useNavigate()

    const borderBottomFill = useRef()
    const input = useRef()

    const [imgLoading,setImgLoading] = useState(true)
    const [searchValue,setSearchValue] = useState('')
    const [img,setImg] = useState('')

    const searchFocused = (e)=>
    {
        borderBottomFill.current.classList.add(styles.bottomBorderFilled)
    }

    const inputBlur = (e) =>
    {
        borderBottomFill.current.classList.remove(styles.bottomBorderFilled)
    }

    const clearSearchValue = (e) =>
    {
        setSearchValue('')
        inputBlur()
    }

    const search = (e) => {
        console.log("wyszukaj fraze " + searchValue)
    }   

    const getUserImg = async()=>
    {
        try
        {
            await refreshToken()
            const response = await axios.get(`${ApiAddress}/user-img`,{headers:{
                "Authorization": `Bearer ${sessionStorage.getItem('token')}`
            },responseType:"blob"})
            const imgUrl = URL.createObjectURL(response.data)
            setImg(imgUrl)
            setImgLoading(false)
        }
        catch(ex)
        {
            if(ex.status === 404)
            {
                setImg(defaultImg)
                setImgLoading(false)
            }
            else
            {
                sessionStorage.removeItem('token')
                sessionStorage.removeItem('refreshToken')

            }
        }
    }

    useEffect(()=>{
        getUserImg()
    },[])

    const logout = async() =>
    {
        try
        {
            axios.post(`${ApiAddress}/logout`,{token:sessionStorage.getItem("refreshToken")})
        }
        catch(ex)
        {

        }
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('refreshToken')
        loggedUserContext.setLoggedUser({})
        loggedContext.setLogged(false)
    }

    return(
        <nav className={styles.topBar}>
            <img src={voxaLogo} className={styles.logo} onClick={e=>navigate('/')}/>

            <search className={styles.search}>
                <form>
                <input type='text' value={searchValue} onChange={e=>setSearchValue(e.target.value)} ref={input} className={styles.searchInput} placeholder='Szukaj czatów i znajomych...' onFocus={e=>{searchFocused(e);e.target.placeholder = ``}} onBlur={e=>{inputBlur(e);e.target.placeholder = `Szukaj czatów i znajomych...`}}/>
                <div className={styles.searchMenu}>
                    <div className={styles.cancelContainer} onClick={clearSearchValue}>
                        <Cancel />
                    </div>
                    <div className={styles.line}></div>
                    <div className={styles.searchIconContainer} onClick={search}>
                        <SearchIcon />
                    </div>
                </div>
                </form>

                <span className={styles.bottomBorder} onClick={e=>input.current.focus()}>
                    <span className={styles.bottomBorderFill} ref={borderBottomFill}></span>
                </span>
            </search>

            <div className={styles.rightMenu}>
                <div className={styles.bellContainer}>
                    <Bell />
                </div>
                <div className={styles.profileContainer}>
                    <div className={styles.profileImg}>
                        {imgLoading?<Loading2 class={styles.loadingSVG} />:<img src={img}/>}
                        
                    </div>
                    <div className={styles.listContainer}>
                        <div className={styles.profileListContainer}>
                            <span className={styles.triangle}></span>
                            <div className={styles.userImage}>
                                {imgLoading?<Loading2 class={styles.loadingSVG} />:<img src={img}/>}
                                
                            </div>
                            <h2 className={styles.username}>{loggedUserContext.loggedUser.username}</h2>
                            <ul>
                                <li onClick={e=>navigate('/profile')}><ProfileIcon/>Profil</li>
                                <li onClick={e=>navigate('/invitations')}><InvitationsIcon />Zaproszenia</li>
                                <li onClick={e=>navigate('/chats')}><ChatIcon />Czaty</li>
                                <li className={styles.liLogout} onClick={logout}><Logout />Wyloguj się</li>
                            </ul>
                        </div>
                    </div>
                    
                </div>
            </div>
        </nav>
    )
}

export default TopBar