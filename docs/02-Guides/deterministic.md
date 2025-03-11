---
sidebar_position: 4
---

# Using a Seed

Cashu token are a bearer asset, meaning that the possession of the `secret` is proof of ownership. This enabled many use cases, but it also means that loosing access to a token equals loosing money. Deterministic secrets however allow us to derive `secrets` from BIP-39 seeds. These secrets (and the respective signatures) can be recreated at any time in the case of loss. For more information about the flow read [NUT-13](https://github.com/cashubtc/nuts/blob/main/13.md) of the Cashu protocol.

## Generating deterministic secrets in Cashu-TS

By default Cashu-TS will create proofs using random secrets. To make sure the library generates deterministic secrets instead two requirements need to be met:

1. Instantiate `CashuWallet` with a `bip39seed`
2. Pass a `counter` to the method that returns new proofs

```ts
const wallet = new CashuWallet(mint, { bip39seed: bip39SeedAsBytes });

const deterministicSecretProofs = await wallet.mintProofs(21, quoteId, {
  counter: 0,
});
```

## Counter

The counter passed to a method is used to determine which index in the BIP-39 derivation path is used to derive a secret. By incrementing the counter, we can create new secrets using the same seed. This is very important, because Cashu mints will not let us use the same secret twice. Therefore we need to make sure to increment the counter, whenever we successfully generated a secret.

```ts
let counter = 0;
const deterministicSecretProofs = await wallet.mintProofs(21, { counter });
// Because mints denominations are usually 2^x,
// this will generate 3 proofs: 16, 4, 1

counter += deterministicSecretProofs.length;
// counter will now be 3 and we can continue to use it

const moreDeterministicSecretProofs = await wallet.mintProofs(21, { counter });
```

:::danger

If we do not increment the counter mints will reject requests for new token because the outputs generated have already been signed before.

:::
