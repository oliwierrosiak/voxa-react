import React from "react";

const messageContext = React.createContext({
    content:'',
    setContent:()=>{},
})

export default messageContext