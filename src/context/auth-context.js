import React, {useState} from "react";

export const AuthContext = React.createContext({
    isAuth: false,
    login: () => {}
});

const ContextProvider = (props) => {
    const [isAuth, setAuth] = useState(false)

    const loginHandler = () => {
        setAuth(true)
    }

    return (
        <AuthContext.Provider value={{isAuth: isAuth, login: loginHandler}}>
            {props.children}
        </AuthContext.Provider>
    )
}


export default ContextProvider
