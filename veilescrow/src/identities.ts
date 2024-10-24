import { Identity } from "@semaphore-protocol/core"

/** Identities */

//  random identity
const randomIdentity = new Identity()

// deterministic identity
const deterministicIdentity = new Identity("secret-message")

console.log("Random Identity:", randomIdentity)

console.log("Deterministic Identity:", deterministicIdentity)
