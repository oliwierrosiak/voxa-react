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
        if(suggestedFriends.length >= 5)
        {
            changeDisplayFriends()
        }
        else
        {
            setUserListCounter({
                start:0,
                end:suggestedFriends.length
            })
        }
    }

    useEffect(()=>{
        if(suggestedFriends.length)
        {
            usersCounterSetter()
        }
    },[suggestedFriends])

    useEffect(()=>{
        if(suggestedFriends.length)
        {
            changeDisplayFriends()

        }
    },[userListCounter])

    useEffect(()=>{
        getData()
    },[])

    const userItemClicked = (id) =>
    {
        const users = [...displayFriends]
        const userIndex = users.findIndex(x=>x._id == id)
        users[userIndex].invitedLocal = true
        console.log(users)
        setDisplayFriends(users)
    }

    return(<>
        <TopBar />

        <main className={styles.main}>
            <article className={styles.article}>
                <h1 className={styles.articleHeader}>Dodawaj Znajomych</h1>
                <div className={styles.people}>
                    {suggestedFFriendsLoading?<div className={styles.loadingItem}><Loading2 /></div>:(noneUsers?<div className={styles.noneUsers}><NoneUsers /><h2>Nie znaleziono żadnych użytkowników</h2></div>:<>
                    <div className={styles.arrow} onClick={e=>changeUserListCounter('down')}>
                        <Back  class={`${styles.arrowLeftSVG} ${userListCounter.start === 0?styles.arrowDisabled:''}`}/>
                    </div>
                    {displayFriends.map(x=><FriendItem item={x} userItemClicked={userItemClicked}/>)}
                    <div className={styles.arrow} onClick={e=>changeUserListCounter('up')}>
                        <Back  class={`${styles.arrowRightSVG} ${userListCounter.end === suggestedFriends.length?styles.arrowDisabled:''}`}/>
                    </div>
                    </>)}
                </div>
            </article>
            <article className={styles.article}>
                <h1 className={styles.articleHeader}>Twoje Czaty</h1>
                <div className={styles.people}></div>
            </article>
        </main>
    </>)
}

export default HomeLogged