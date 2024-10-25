# VeilEscrow

![VeilEscrow]()

## Anonymous Escrow Marketplace

This project is an anonymous escrow marketplace that leverages Semaphore to handle user identities without revealing wallet addresses. Users can connect via a wallet or email, managed through thirdweb for seamless identity creation and management, allowing them to join as owners or participants.

In this marketplace:

- **Owners** create an escrow and a Semaphore group that participants must join to interact securely and privately within the marketplace.
- **Chainlink VRF** is integrated to ensure random selection of participants, providing transparency and fairness in escrow operations.

With this marketplace, we aim to deliver a secure, private, and decentralized platform for anonymous escrow transactions.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

## Run locally

Install dependencies

```bash
yarn
```

Start development server

```bash
yarn dev
```

Create a production build

```bash
yarn build
```

Preview the production build

```bash
yarn start
```
