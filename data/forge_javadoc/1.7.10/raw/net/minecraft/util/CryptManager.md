---
title: "CryptManager"
description: "public class CryptManager extends java.lang.Object"
package: "net/minecraft/util"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/util/CryptManager.html"
sourceType: javadoc
---

# CryptManager

**Inheritance:** java.lang.Object → net.minecraft.util.CryptManager

## Class signature

```java
public class CryptManager extends java.lang.Object
```

## Constructors

- `CryptManager()`

## Methods

- `static java.security.KeyPair createNewKeyPair()`
- `static javax.crypto.SecretKey createNewSharedKey()`
- `static java.security.PublicKey decodePublicKey(byte[] p_75896_0_)`
- `static byte[] decryptData(java.security.Key p_75889_0_, byte[] p_75889_1_)`
- `static javax.crypto.SecretKey decryptSharedKey(java.security.PrivateKey p_75887_0_, byte[] p_75887_1_)`
- `static byte[] encryptData(java.security.Key p_75894_0_, byte[] p_75894_1_)`
- `static javax.crypto.Cipher func_151229_a(int p_151229_0_, java.security.Key p_151229_1_)`
- `static byte[] getServerIdHash(java.lang.String p_75895_0_, java.security.PublicKey p_75895_1_, javax.crypto.SecretKey p_75895_2_)`
