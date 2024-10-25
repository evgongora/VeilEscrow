import { XataClient } from "@/xata";

export function createXataClient() {
    return new XataClient({
        apiKey: process.env.XATA_API_KEY,
        branch: process.env.XATA_BRANCH
    });
}