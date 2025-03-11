---
sidebar_position: 5
---

# Restoring from a Seed

If you used [deterministic secrets](./deterministic.md) to [mint Proofs](./minting.md) you can restore them at any given time using the seed and some help of the mint.
First we instantiate a `CashuWallet` using our `bip39seed`, then we use the `restore` method to derive our secrets and ask the mint for the corresponding signatures. The mint will respond with a signature for every output it has signed in the past.

It is recommended to restore in batches of 100 secrets. Once 3 batches are returned empty we consider the restoration to be completed.

:::info
The gap limit of 300 is recommended by the Cashu specifications and can be changed if your use case requires it.
:::

```ts
const wallet = new CashuWallet(mint, { bip39seed: yourSeedInBytes });

async function batchRestore(
  counter: number = 0,
  currentGap: number = 0,
  accProofs: Array<Proof> = [],
  lastFoundCounter: number = 0,
) {
  if (currentGap >= 300) {
    return { proofs: accProofs, lastCounter: lastFoundCounter };
  }

  const { proofs } = await wallet.restore(counter, 100);
  if (proofs.length === 0) {
    return batchRestore(
      counter + 100,
      currentGap + 100,
      [...accProofs, ...proofs],
      lastFoundCounter,
    );
  } else {
    return batchRestore(counter + 100, 0, [...accProofs, ...proofs], counter);
  }
}

const restoredProofs = await batchRestore();
```

This function will restore ALL the proofs that were ever generated using this seed and mint up to the gap limit.
Some of these proofs might be spent already. Make sure to check their state before using them.
