class UserService {
    async getUser(access_token: string) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        });
        console.log(response)
        const json = await response.json()
        return json
    }
}

export const userService = new UserService()