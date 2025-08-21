import { useContext, useEffect, useId, useRef, useState } from 'react'
import styles from './chat.module.css'
import FileIcon from '../../assets/svg/fileIcon'
import Loading1 from '../../assets/svg/loading1'
import refreshToken from '../helpers/refreshToken'
import ApiAddress from '../../ApiAddress'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import messageContext from '../context/messageContext'

function File(props)
{
    const [loading,setLoading] = useState(false)

    const message = useContext(messageContext)

    const getFile = async()=>{
        try
        {
            setLoading(true)
            await refreshToken()
            const response = await axios.get(`${ApiAddress}/download-file/${props.file.dbName}/${props.file.name}`,{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`},responseType:'blob'})
            const newUrl = URL.createObjectURL(response.data)
            
           const a = document.createElement('a');
            a.href = newUrl;
            a.download = props.file.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setLoading(false)
        }
        catch(ex)
        {
            setLoading(false)
            message.setContent('Nie udało się pobrać pliku','error')
        }
    }


    return(
        <div className={styles.fileContainer2}>
            <div className={styles.fileIconContainer} onClick={getFile}>
                {loading?<Loading1 />:<FileIcon class={styles.fileIcon}/>}
            </div>
            <p className={styles.fileName}>{props.file.name}</p>
        </div>
    )
}

export default File