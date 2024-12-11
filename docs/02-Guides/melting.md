---
sidebar_position: 2
---

# Melting Proofs

**Melting** is the reverse of [minting](minting.md). It involves paying [Proofs](https://github.com/cashubtc/nuts/blob/main/00.md#proof) back to the mint to settle an external Lightning invoice. This process consists of three steps:

1. Request a melt quote for the invoice.
2. Submit the required Proofs (including a fee reserve, if applicable).
3. Confirm whether the invoice was paid and collect any change.

:::warning
Mints only refund overpaid fees. To ensure your inputs match the required amount, use `CashuWallet.send()` beforehand to swap Proofs as needed.
:::

```ts
const quote = await wallet.createMeltQuote(mintQuote.request);
const fee = quote.fee_reserve;

const {keep, send} = await wallet.send(10, proofs});

const response = await wallet.meltProofs(quote, send);
```

## Fee Reserve and Change

Mints may include a fee reserve to cover anticipated Lightning fees. The `cashu-ts` library automatically appends [blank outputs](https://github.com/cashubtc/nuts/blob/main/08.md) to the melt request and mints new Proofs if change is returned.

## Options

`meltProofs` accepts a range of options to control the shape of the minted Proofs. Check out the [API Reference](https://github.com/cashubtc/cashu-ts/blob/main/src/CashuWallet.ts) for more information
