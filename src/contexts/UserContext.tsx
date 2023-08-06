import { ReactElement, createContext, useEffect, useState } from "react";
import { tokenService } from "../services/TokenService";
import { userService } from "../services/UserService";
import { UserDTO } from "../dtos/UserDTO";

export const userContext = createContext(null as any as UserDTO)

type Props = {
    children: ReactElement
}

export default function UserProvider({ children }: Props) {

    const [user, setUser] = useState(null as any as UserDTO)

    useEffect(() => {
        (async () => {
            if (tokenService.hasURLToken()) {
                const token = tokenService.getURLToken() as string
                tokenService.storeToken(token)
                const foundUser = await userService.getUser()
                setUser(foundUser)
            } else if (tokenService.hasToken()) {
                const foundUser = await userService.getUser()
                setUser(foundUser)
                console.log("There is TOKEN in LocalStorage")
            } else {
                console.log("There is NO Token")
            }
        })()
    }, [])

    return (
        <userContext.Provider value={user}>
            {children}
        </userContext.Provider>
    )
}