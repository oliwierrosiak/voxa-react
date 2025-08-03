import React from "react";

const LoginContext = React.createContext({
    logged:false,
    setLogged:()=>{},
})

export default LoginContext