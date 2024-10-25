import { useEffect, useState } from "react"
import { useActiveAccount } from "thirdweb/react"
import { signLoginPayload } from "thirdweb/auth"
import { Identity } from "@semaphore-protocol/identity"

const useSemaphoreIdentity = () => {
    const activeAccount = useActiveAccount()
    const [identity, setIdentity] = useState<Identity | null>(null)

    useEffect(() => {
        const createIdentity = async () => {
            if (activeAccount) {
                const newIdentity = new Identity(activeAccount.address)
                setIdentity(newIdentity)
                
                // Generate job URIs based on job IDs
                const jobIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; // Example job IDs
                const jobResources = jobIds.map(id => `https://yourdomain.com/jobs/${id}`);

                // Sign a login payload
                const loginPayload = {
                    statement: "Sign in to access the Semaphore group",
                    resources: jobResources, // Use the generated job URIs
                    domain: window.location.hostname, // Use the current domain
                    address: activeAccount.address, // Add the account address
                    version: "1", // Specify the version
                    nonce: Math.floor(Math.random() * 1000000).toString(), // Generate a random nonce
                    issued_at: new Date().toISOString(), // Add issued_at
                    expiration_time: new Date(Date.now() + 3600 * 1000).toISOString(), // Add expiration_time (1 hour later)
                    invalid_before: new Date(Date.now() - 3600 * 1000).toISOString(), // Add invalid_before (1 hour before)
                }

                const { signature, payload } = await signLoginPayload({
                    account: activeAccount,
                    payload: loginPayload,
                })

                console.log("Signature:", signature)
                console.log("Payload:", payload)
            } else {
                setIdentity(null)
            }
        }

        createIdentity()
    }, [activeAccount])

    return identity
}

export default useSemaphoreIdentity
