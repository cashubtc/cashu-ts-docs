---
sidebar_position: 1
---

# Minting Proofs

**Minting** is the operation of making a Lightning payment to the mint to receive some [Proofs](https://github.com/cashubtc/nuts/blob/main/00.md#proof) in return.
This is a three step process:

1. Request the mint quote for amount `x`
2. Settle the attached payment request
3. Mint Proofs

```ts
const quoteRes = await wallet.createMintQuote(21);
const paymentRequest = quoteRes.request;

// Settle the payment request, then proceed
const proofs = await wallet.mintProofs(21, quoteRes.quote);
```

## Options

`mintProofs` accepts a range of options to control the shape of the minted Proofs. Check out the [API Reference](https://github.com/cashubtc/cashu-ts/blob/main/src/CashuWallet.ts#L672) for more information
