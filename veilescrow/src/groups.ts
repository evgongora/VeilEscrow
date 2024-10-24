import { Identity, Group } from "@semaphore-protocol/core"

/** Identities */

/**
 * members are created using the deterministic way so that
 * they can be recreated later using the same secret-message.
 * In this case the secret message is the number i converted to string.
 */

// array of members to add to the group
const members: bigint[] = Array.from({ length: 10 }, (_, i) => new Identity(`${i}n`)).map(
    ({ commitment }) => commitment
)

/** Groups */

// create a group with the members above
const group = new Group(members)

console.log("Group size: ", group.members.length)
