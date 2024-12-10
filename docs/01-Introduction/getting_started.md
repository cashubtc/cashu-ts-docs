---
sidebar_position: 1
---

# Getting Started

What follows is a tour of the installation, as well as the most important aspects of `cashu-ts`. After reading through this section you should be able to build a simplistic cashu wallet in a browser or node environment.

## Installation

`cashu-ts` is available on NPM. Install it using your favourite package manager:

```sh
npm i @cashu/cashu-ts
```

## Importing

`cashu-ts` exports everything from a single file. As of today, there are no sub-module exports. Importing is therefore as easy as:

```ts
import { CashuMint, CashuWallet } from "@cashu/cashu-ts";

const mint = new CashuMint(mintUrl);
const wallet = new CashuWallet(mint);
```
