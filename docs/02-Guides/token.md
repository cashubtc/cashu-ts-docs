---
sidebar_position: 3
---

# Creating a Token

A **Token** is what we use when we transfer money from one wallet to another. Technically speaking a **Token** is an object containing a list of [Proofs](https://github.com/cashubtc/nuts/blob/main/00.md#proof) and a URL of the corresponding mint. It might also include some metadata.

```ts
const t: Token = {
  proofs: [...proofs],
  mint: "https://minturl.com",
  memo: "Hello world",
};
```

## Encoding

Token are usually encoded before they are transmitted. `cashu-ts` supports both Token V3 and Token V4 encoding.

```ts
const encodedV3 = getEncodedToken(t, { version: 3 });

const encodedV4 = getEncodedToken(t, { version: 4 });
// or
const encodedV4 = getEncodedToken(t);
```

:::warning

While `getEncodedToken` will default to V4 encoding in most cases, some proofs with older, non-hex keyset IDs can not be encoded to V4. In this case getEncodedToken will automatically fallback to V3 encoding.

:::

## Decoding

Decoding a Token string back to the **Token** object can be done using the `getDecodedToken` utility.

```ts
const decoded = getDecodedToken(tokenString);
```
