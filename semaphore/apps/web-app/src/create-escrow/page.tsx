"use client"

import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import { useLogContext } from "../../context/LogContext"
import { useSemaphoreContext } from "../../context/SemaphoreContext"
import useSemaphoreIdentity from "../../hooks/useSemaphoreIdentity"

export default function CreateEscrowPage() {
    const router = useRouter()
    const { setLog } = useLogContext()
    const { _users, addUser } = useSemaphoreContext()
    const { _identity } = useSemaphoreIdentity()
    const [_loading, setLoading] = useState(false)

    const createEscrow = useCallback(async () => {
        if (!_identity) {
            setLog("Please create an identity first")
            return
        }

        setLoading(true)
        setLog("Creating a new escrow group...")

        try {
            // Here you would interact with your smart contract to create a new escrow group
            // For now, we'll just simulate it by adding the user to the group
            await addUser(_identity.commitment.toString())
            setLog("New escrow group created successfully!")
            router.push("/")
        } catch (error) {
            console.error(error)
            setLog("Error creating escrow group. Please try again.")
        } finally {
            setLoading(false)
        }
    }, [_identity, addUser, setLog, router])

    return (
        <>
            <h2>Create Escrow</h2>

            <p>Create a new escrow group using your Semaphore identity.</p>

            <div className="divider" />

            <button
                className="button"
                onClick={createEscrow}
                disabled={_loading || !_identity}
                type="button"
            >
                Create Escrow Group
                {_loading && <div className="loader"></div>}
            </button>

            <div className="divider" />

            <button className="button" onClick={() => router.push("/")} type="button">
                Back to Home
            </button>
        </>
    )
}

