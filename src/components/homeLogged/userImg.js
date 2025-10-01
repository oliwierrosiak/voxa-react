import { useState } from "react"
import Loading2 from "../../assets/svg/loading2"
import styles from './homeLogged.module.css'
import defaultImg from '../../assets/img/default.jpg'

function UserImg(props)
{
    const [loading,setLoading] = useState(true)

    return(
        <>
        {loading?<div className={styles.loadingInnerContainer}><Loading2 class={styles.loadingSVG}/></div>:null}
        <img src={props.img} onError={(e)=>e.target.src=defaultImg} onLoad={()=>setLoading(false)}/>
        </>
    )
}

export default UserImg