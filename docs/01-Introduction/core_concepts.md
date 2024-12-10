---
sidebar_position: 2
---

# Core Concepts

`cashu-ts` is a mostly stateless library. It expects consumers to take care of state management themselves. Therefore all exported members can be instantiated and thrown away all the time.

## CashuWallet & CashuMint Classes

The core API of this package is organised into two main Classes: `CashuWallet` and `CashuMint`. It is important to note, that you will rarely interact with the `CashuMint` class directly. It is mostly used to expose implementation of the cashu protocol to the library and is accessed by the `CashuWallet` class.

```ts
const mint = new CashuMint(mintUrl);
// We typically wont use this. But CashuWallet needs it to communicate with a mint
const wallet = new CashuWallet(mint);
// We call methods on the CashuWallet instance
const mintQuote = await wallet.createMintQuote(21);
```

## State

While each of the classes keep some operational state, implementers are responsible to handle most of the state involved in building a wallet themselves. The library will for example consume proofs and produce new ones, but getting and then storing them in a database is the consumers responsibility.

Because of this `cashu-ts` classes can be instantiated and thrown away without having to worry about internal state and are interoperable.

```ts
const mint = new CashuMint(mintUrl);
const wallet = new CashuWallet(mint);
// We can create a mintQuote in one instance
const mintQuote = await wallet.createMintQuote(21);
// Instantiate another instance (using the same mint);
const secondWalletClass = new CashuWallet(mint);
// And use the same quote on this instance
const proofs = await secondWalletClass.mintProofs(mintQuote.quote);
```

:::warning

This interoperability is limited by the rules of the Cashu protocol. You can not redeem a quote of mint A with mint B

:::
