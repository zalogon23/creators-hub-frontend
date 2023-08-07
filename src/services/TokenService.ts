
class TokenService {
    getRefreshToken = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/refresh-token`, {
            method: "POST",
            credentials: 'include'
        });
        const json = await response.json()
        return json.token
    }

    storeToken(token: string) {
        localStorage.setItem("token", token)
    }

    getToken() {
        return localStorage.getItem("token") ?? ""
    }

    hasToken() {
        return !!localStorage.getItem("token")
    }

    getURLToken() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("access_token");
    }

    hasURLToken() {
        return !!this.getURLToken();
    }
}

export const tokenService = new TokenService()