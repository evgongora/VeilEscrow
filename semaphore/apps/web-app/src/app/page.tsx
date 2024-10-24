"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLogContext } from "@/context/LogContext"
import { useSemaphoreContext } from "@/context/SemaphoreContext"
import useSemaphoreIdentity from "@/hooks/useSemaphoreIdentity"
import { Contract, JsonRpcProvider, Wallet } from "ethers"
import Escrow from "@/contract-artifacts/Escrow.json"

export default function CreateEscrowPage() {
    const router = useRouter()
    const { setLog } = useLogContext()
    const { addUser } = useSemaphoreContext()
    const { _identity } = useSemaphoreIdentity()
    const [arbiter, setArbiter] = useState("")
    const [beneficiary, setBeneficiary] = useState("")
    const [amount, setAmount] = useState("")
    const [loading, setLoading] = useState(false)

    const createEscrow = async () => {
        if (!_identity) {
            setLog("Please create an identity first")
            return
        }

        setLoading(true)
        setLog("Creating a new escrow...")

        try {
            const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
            const signer = new Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY as string, provider)
            const escrowFactory = new Contract(process.env.NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS as string, Escrow.abi, signer)

            const tx = await escrowFactory.createEscrow(arbiter, beneficiary, { value: amount })
            await tx.wait()

            const escrowAddress = await escrowFactory.getLastEscrow()
            const escrowContract = new Contract(escrowAddress, Escrow.abi, signer)

            await escrowContract.joinGroup(_identity.commitment)
            await addUser(_identity.commitment.toString())

            setLog("New escrow created and joined successfully!")
            router.push("/")
        } catch (error) {
            console.error(error)
            setLog("Error creating escrow. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <h2>Create Escrow</h2>
            <div>
                <input
                    type="text"
                    placeholder="Arbiter address"
                    value={arbiter}
                    onChange={(e) => setArbiter(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Beneficiary address"
                    value={beneficiary}
                    onChange={(e) => setBeneficiary(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Amount (in wei)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <button
                    className="button"
                    onClick={createEscrow}
                    disabled={loading || !_identity}
                >
                    Create Escrow
                    {loading && <div className="loader"></div>}
                </button>
            </div>
            <button className="button" onClick={() => router.push("/")} type="button">
                Back to Home
            </button>
            {_identity && (
                <div>
                    <button className="button" onClick={() => router.push("/create-escrow")} type="button">
                        Create Escrow
                    </button>
                    <button className="button" onClick={() => router.push("/join-escrow")} type="button">
                        Join Escrow
                    </button>
                </div>
            )}
        </>
    )
}
