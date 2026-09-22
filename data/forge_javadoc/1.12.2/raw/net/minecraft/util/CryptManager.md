---
title: "CryptManager"
description: "public class CryptManager extends java.lang.Object"
package: "net/minecraft/util"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/util/CryptManager.html"
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

- `static javax.crypto.Cipher createNetCipherInstance(int opMode, java.security.Key key)`
- `static javax.crypto.SecretKey createNewSharedKey()`
- `static java.security.PublicKey decodePublicKey(byte[] encodedKey)`
- `static byte[] decryptData(java.security.Key key, byte[] data)`
- `static javax.crypto.SecretKey decryptSharedKey(java.security.PrivateKey key, byte[] secretKeyEncrypted)`
- `static byte[] encryptData(java.security.Key key, byte[] data)`
- `static java.security.KeyPair generateKeyPair()`
- `static byte[] getServerIdHash(java.lang.String serverId, java.security.PublicKey publicKey, javax.crypto.SecretKey secretKey)`
