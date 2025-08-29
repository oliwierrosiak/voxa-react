import styles from './search.module.css'
import { useState, useEffect } from 'react'
import Back from '../../assets/svg/back'
import FriendItem from '../homeLogged/friendItem'
import ChatElement from '../homeLogged/chatElement'

function Article(props)
{
    const setMaxState = () =>
    {
        if(props.chat)
        {
            return props.fullHeight?6:3
        }
        else
        {
             return props.fullHeight?10:5
        }
    }

    const [max,setMax] = useState(setMaxState)

    const [counter,setCounter] = useState({
        start:0,
        end:max,
    })

    

    const [displayUsers,setDisplayUsers] = useState([])

    const setDisplayingUsers = () =>{
         const users = [...props.users]
         const userToDisplay = []
         for(let i = counter.start;i<counter.end;i++)
         {
            userToDisplay.push(users[i])
         }
         setDisplayUsers(userToDisplay)
    }

    const changeCounter = (dir) =>
    {
        const localCounter = {...counter}
        if(dir === "left")
        {
            if(localCounter.start > 0)
            {
                localCounter.start -= 1
                localCounter.end -= 1
            }
        }
        else if(dir === "right")
        {
            if(localCounter.end < props.users?.length)
            {
                localCounter.end += 1
                localCounter.start += 1
            }
        }

        setCounter({...localCounter})
    }

    useEffect(()=>{
        if(props.users)
        {
            if(props.users.length > max)
            {
                setDisplayingUsers()
            }
            else
            {
                setDisplayUsers(props.users)
            }
            
        }

        return()=>{
            setCounter({
                start:0,
                end:3,
            })
        }
            
    },[props.users])

    useEffect(()=>{
        if(props.users)
        {
            if(props.users.length > max)
            {
                setDisplayingUsers()
            }
        }
       
    },[counter])

    const userItemClicked = (id) =>
    {
        const users = [...displayUsers]
        const userIndex = users.findIndex(x=>x._id == id)
        users[userIndex].invitedLocal = true
        setDisplayUsers(users)
    }

    return(
        <article className={`${styles.users} ${props.fullHeight?styles.fullHeight:''}`}>
            <div className={styles.leftArrowContainer} onClick={e=>changeCounter('left')}>
                {props.users.length > max && <Back  class={`${styles.arrowLeftSVG} ${counter.start === 0?styles.arrowDisabled:''}`}/>}
            </div>
            {props.chat?<>
            {displayUsers.map(x=><ChatElement key={Math.floor(Math.random()*10000)} {...x} class={styles.chatElement}/>)}
            </>:displayUsers.map(x=><FriendItem key={Math.floor(Math.random()*10000)} class={styles.user} userItemClicked={userItemClicked} item={x}/>)}
            <div className={styles.rightArrowContainer} onClick={e=>changeCounter('right')}>
                {props.users.length > max && <Back  class={`${styles.arrowRightSVG} ${counter.end === props.users.length?styles.arrowDisabled:''}`}/>}
            </div>
        </article>
    )
}

export default Article