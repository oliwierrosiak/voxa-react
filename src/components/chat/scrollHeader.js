import styles from './chat.module.css'
import ArrowIcon from '../../assets/svg/arrow'
import UserImg from '../homeLogged/userImg'
import { useEffect, useRef, useState } from 'react'

function ScrollHeader(props)
{


    const scrollHeader = useRef()


    const chatContent = useRef()
    const headerRef = useRef()


    const [scrollHeaderDisplay,setScrollHeaderDisplay] = useState(false)

    const chatScroll = () =>{
        if(headerRef.current)
        {
            setScrollHeaderDisplay(headerRef?.current?.getBoundingClientRect().top + headerRef?.current?.clientHeight * 0.8 < 0)
        }
    }

   

    useEffect(()=>{
        if(scrollHeaderDisplay)
        {
            setTimeout(() => {
                scrollHeader?.current?.classList.add(styles.scrollHeaderTransition)
            }, 50);
        }
        else
        {
            scrollHeader?.current?.classList.remove(styles.scrollHeaderTransition)
        }
    },[scrollHeaderDisplay])

    useEffect(()=>{
        chatScroll()
        chatContent.current = document.querySelector('#chatContent')
        headerRef.current = document.querySelector("#chatHeader")
    },[])

    useEffect(()=>{
        if(chatContent.current)
        {
            chatContent.current.addEventListener('scroll',chatScroll)

        }
    },[chatContent.current])



    return(
        <header className={`${styles.scrollHeader} ${scrollHeaderDisplay?styles.scrollHeaderDisplay:''}`} ref={scrollHeader}>
            <div className={styles.responsiveArrow2} onClick={e=>props.setDisplayAside(!props.displayAside)}>
                <ArrowIcon class={styles.arrowSVG} />
            </div>
            <div className={styles.scrollHeaderImgContainer}>
                <UserImg img={props.user.img} />
            </div>
            <h1 className={styles.scrollHeaderUsername}>{props.user.username}</h1>
        </header>
    )
}

export default ScrollHeader