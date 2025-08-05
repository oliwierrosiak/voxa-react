import { useEffect } from 'react'
import styles from './invitations.module.css'
import PageAuthorization from '../helpers/pageAuthorization'


function Invitations(props)
{
    return(
        <>
            <PageAuthorization />
            <div>Zaproszenia</div>
        </>
    )
}

export default Invitations