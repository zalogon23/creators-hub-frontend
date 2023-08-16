class SubscriptionService {
    async subscribe(subscribeeId: string, subscribed: boolean, access_token: string) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/subscription`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                subscribed,
                subscribeeId
            })
        });
        const json = await response.json()
        return json
    }
}

export const subscriptionService = new SubscriptionService()