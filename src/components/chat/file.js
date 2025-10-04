import { useContext } from 'react'
import styles from './chat.module.css'
import FileIcon from '../../assets/svg/fileIcon'
import messageContext from '../context/messageContext'
import axios from 'axios'

function File(props)
{
    const message = useContext(messageContext)

    const getFile = async()=>{
        try
        {
            if(!props.file.link)
                throw new Error()
            const response = await axios.get(props.file.link,{responseType:'blob'})
            if(!response.data)
                throw new Error()
            const url = URL.createObjectURL(response.data)
            const a = document.createElement('a');
            a.href = url;
            a.target = "_blank"
            a.download = props.file.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
        catch(ex)
        {
            console.log(ex)
            message.setContent('Nie udało się pobrać pliku','error')
        }
    }


    return(
        <div className={styles.fileContainer2}>
            <div className={styles.fileIconContainer} onClick={getFile}>
                <FileIcon class={styles.fileIcon}/>
            </div>
            <p className={styles.fileName}>{props.file.name}</p>
        </div>
    )
}

export default File