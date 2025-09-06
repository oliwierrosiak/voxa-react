import { useContext, useEffect, useState } from 'react'
import TopBar from '../topBar/topBar'
import styles from './homeLogged.module.css'
import Loading2 from '../../assets/svg/loading2'
import refreshToken from '../helpers/refreshToken'
import ApiAddress from '../../ApiAddress'
import axios from 'axios'
import Back from '../../assets/svg/back'
import FriendItem from './friendItem'
import NoneUsers from '../../assets/svg/noneUsers'
import logoutContext from '../context/logoutContext'
import messageContext from '../context/messageContext'
import ChatElement from './chatElement'
import { socket } from '../../App'
import sound from '../../assets/sound/message.mp3'

function HomeLogged()
{
    const [suggestedFriends,setSuggestedFriends] = useState([])
    const [suggestedFFriendsLoading,setSuggestedFriendLoading] = useState(true)
    const [displayFriends,setDisplayFriends] = useState([])
    const [userListCounter,setUserListCounter] = useState({
        start:0,
        end:5,
    })
    const [noneUsers,setNoneUsers] = useState(false)
    const [myChats,setMyChats] = useState([])
    const [myChatsLoading,setMyChatsLoading] = useState(true)
    const [myChatsError,setMyChatsError] = useState(false)
    const [myAllChats,setMyAllChats] = useState([])

    const message = useContext(messageContext)
    const logoutContextHandler = useContext(logoutContext)


    const changeDisplayFriends = () =>
    {
        const userToDisplay = []
        for(let i = userListCounter.start;i<userListCounter.end;i++)
        {
            userToDisplay.push(suggestedFriends[i])
        }
        setDisplayFriends(userToDisplay)
        setSuggestedFriendLoading(false)
    }

    const changeUserListCounter = (dir)=>
    {
        const counter = {...userListCounter}
        if(dir === "up")
        {
            if(counter.end < suggestedFriends.length)
            {
                counter.start+=1
                counter.end+=1
                setUserListCounter(counter)
            }
        }
        else if(dir === "down")
        {
            if(counter.start > 0)
            {
                counter.start-=1
                counter.end-=1
                setUserListCounter(counter)
            }
        }
    }

    const getData = async()=>
    {

        try
        {
            await refreshToken()
            const response = await axios.get(`${ApiAddress}/get-suggested-users`,{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`}})
            setSuggestedFriends(response.data)
        }
        catch(ex)
        {
            if(ex.status === 404)
            {
                setNoneUsers(true)
                setSuggestedFriendLoading(false)
            }
            else
            {
                message.setContent('Wystąpił bład serwera',"error")
                logoutContextHandler.logout()
            }
        }
    }

    const usersCounterSetter = () =>
    {
        if(suggestedFriends.length >= 5 && window.innerWidth > 425)
        {
            changeDisplayFriends()
            setUserListCounter({
                start:0,
                end:5
            })
        }
        else
        {
            setUserListCounter({
                start:0,
                end:suggestedFriends.length
            })
        }
    }

    const setMyChatsCount = () =>
    {
        if(window.innerWidth > 425)
        {
            const chats = []
            for(let i =0;i<3;i++)
            {
                if(myAllChats[i])
                {
                    chats.push(myAllChats[i])
                }
                else
                {
                    continue
                }
            }
            setMyChats(chats)
        }
        else
        {
            setMyChats(myAllChats)
        }
        
    }

    const getMyChats = async()=>{
         try
        {
            await refreshToken()
            const response = await axios.get(`${ApiAddress}/get-my-chats`,{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`}})
            setMyAllChats(response.data)
            setMyChatsLoading(false)
        }
        catch(ex)
        {
            if(ex.status === 404)
            {
                setMyChatsError(true)
                setMyChatsLoading(false)

            }
            else
            {
                message.setContent('Wystąpił bład serwera',"error")
                logoutContextHandler.logout()
            }
        }
    }

    const windowResize2 = () =>
    {
        setMyChatsCount()
    }

    useEffect(()=>{
        if(myAllChats.length)
        {
            window.addEventListener('resize',windowResize2)
            setMyChatsCount()
        }
        return () =>{
            window.removeEventListener('resize',windowResize2)
        }
    },[myAllChats])

    const windowResize = () =>
    {
        usersCounterSetter()
    }

    useEffect(()=>{
        if(suggestedFriends.length)
        {
            window.addEventListener('resize',windowResize)
            usersCounterSetter()
        }
        return()=>{
            window.removeEventListener('resize',windowResize)
        }
    },[suggestedFriends])

    useEffect(()=>{
        if(suggestedFriends.length)
        {
            changeDisplayFriends()

        }
    },[userListCounter])

     const socketUpdate = (res) =>{

        const notify = new Audio(sound)
        if(res.type === "new")
        {
            notify.play()
            getMyChats()
        }
    }



    useEffect(()=>{
        getData()
        getMyChats()
        socket.on('chatUpdate',socketUpdate)
        return ()=>{
            socket.off('chatUpdate',socketUpdate)
        }
    },[])

    const userItemClicked = (id) =>
    {
        const users = [...displayFriends]
        const userIndex = users.findIndex(x=>x._id == id)
        users[userIndex].invitedLocal = true
        setDisplayFriends(users)
    }

    return(<>
        <TopBar />

        <main className={styles.main}>
            <article className={styles.article}>
                <h1 className={styles.articleHeader}>Dodawaj Znajomych</h1>
                <div className={styles.people}>
                    {suggestedFFriendsLoading?<div className={styles.loadingItem}><Loading2 /></div>:(noneUsers?<div className={styles.noneUsers}><NoneUsers /><h2>Nie znaleziono żadnych użytkowników</h2></div>:<div className={styles.peopleList}>
                    <div className={styles.arrow} onClick={e=>changeUserListCounter('down')}>
                        {suggestedFriends.length > 5 && <Back  class={`${styles.arrowLeftSVG} ${userListCounter.start === 0?styles.arrowDisabled:''}`}/>}
                        
                    </div>
                    {displayFriends.map(x=><FriendItem item={x} key={x._id} userItemClicked={userItemClicked}/>)}
                    <div className={styles.arrow} onClick={e=>changeUserListCounter('up')}>
                        {suggestedFriends.length > 5 && <Back  class={`${styles.arrowRightSVG} ${userListCounter.end === suggestedFriends.length?styles.arrowDisabled:''}`}/>}
                        
                    </div>
                    </div>)}
                </div>
            </article>
            <article className={styles.article}>
                <h1 className={styles.articleHeader}>Twoje Czaty</h1>
                <div className={styles.chats}>
                    {myChatsLoading?<div className={styles.myChatsLoading}>
                        <Loading2 class={styles.myChatsLoadingSVG}/>
                    </div>:(myChatsError?<div className={styles.noneUsers}>
                        <NoneUsers />
                        <h2>Nie masz żadnych czatów</h2>
                    </div>:<>{myChats.map(x=><ChatElement key={x._id} {...x} />
                    )}
                    </>)}
                </div>
                {!myChatsError && <a href='/chats' className={styles.showAllChats}>Zobacz wszystkie czaty</a>}
            </article>
        </main>
    </>)
}


export default HomeLogged