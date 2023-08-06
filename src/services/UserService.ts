class UserService {
    async getUser(access_token: string) {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user`, {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        });
        const json = await response.json()
        return json
    }
}

export const userService = new UserService()