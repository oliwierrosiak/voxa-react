import { useEffect, useState } from "react"

function NotificationDate(props)
{
    const currentDate = new Date()
    const [date,setDate] = useState(new Date(props.date))

    const [displayDate,setDisplayDate] = useState('')

    useEffect(()=>{
        if(currentDate.getDate() == date.getDate() && currentDate.getMonth() == date.getMonth() && currentDate.getFullYear() == date.getFullYear())
        {
            setDisplayDate(`${date.getHours()<10?0:''}${date.getHours()}:${date.getMinutes()<10?0:''}${date.getMinutes()}`)
        }
        else
        {
            setDisplayDate(`${date.getDate()+1}.${date.getMonth()+1 < 10?0:''}${date.getMonth()+1}`)
        }
    },[])

    return(
        <>
        {displayDate}
        </>
    )
}

export default NotificationDate