---
title: "CryptManager"
description: "public class CryptManager extends java.lang.Object"
package: "net/minecraft/util"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/util/CryptManager.html"
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

- `static javax.crypto.Cipher createNetCipherInstance(int opMode, java.security.Key key)` — Creates an Cipher instance using the AES/CFB8/NoPadding algorithm.
- `static javax.crypto.SecretKey createNewSharedKey()` — Generate a new shared secret AES key from a secure random source
- `static java.security.PublicKey decodePublicKey(byte[] encodedKey)` — Create a new PublicKey from encoded X.509 data
- `static byte[] decryptData(java.security.Key key, byte[] data)` — Decrypt byte[] data with RSA private key
- `static javax.crypto.SecretKey decryptSharedKey(java.security.PrivateKey key, byte[] secretKeyEncrypted)` — Decrypt shared secret AES key using RSA private key
- `static byte[] encryptData(java.security.Key key, byte[] data)` — Encrypt byte[] data with RSA public key
- `static java.security.KeyPair generateKeyPair()` — Generates RSA KeyPair
- `static byte[] getServerIdHash(java.lang.String serverId, java.security.PublicKey publicKey, javax.crypto.SecretKey secretKey)` — Compute a serverId hash for use by sendSessionRequest()
