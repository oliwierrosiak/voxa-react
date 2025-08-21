import { useEffect, useState } from "react"
import styles from './chat.module.css'

function Message(props)
{
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const parts = props.message.split(urlRegex);

    return(
        <div className={styles.messageContent}>
        {parts.map((part, index) => {
        if (part.match(urlRegex)) {
          return (
            <a key={index} className={styles.messageLink} href={part} target="_blank">
              {part}
            </a>
          );
        } else {
          return part;
        }
      })}
      </div>
        
    )
}

export default Message