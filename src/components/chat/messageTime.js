import { useEffect, useState } from "react"

function MessageTime(props)
{
    const [result,setResult] = useState(`0:00`)

    useEffect(()=>{
        setResult(`0:00`)
        let interval
        if(props.recording)
        {
            const date = new Date()
            interval = setInterval(()=>{
                const localDate = new Date()
                const time = new Date(localDate.getTime()-date.getTime())

                    setResult(`${time.getMinutes()}:${time.getSeconds()<10?'0':''}${time.getSeconds()}`)

            },1000)
        }
        return ()=>{
            clearInterval(interval)
        }
    },[props.recording])

    return(
        <>{result}</>
    )
}
export default MessageTime