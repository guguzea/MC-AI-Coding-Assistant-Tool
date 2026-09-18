---
title: "CryptManager"
description: "public class CryptManager extends java.lang.Object"
package: "net/minecraft/util"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/util/CryptManager.html"
sourceType: javadoc
---

# CryptManager

## Class signature

```java
public class CryptManager extends java.lang.Object
```

## Constructors

- `public CryptManager()`

## Methods

- `public static javax.crypto.SecretKey createNewSharedKey()`
- `public static java.security.KeyPair generateKeyPair()`
- `public static byte[] getServerIdHash(java.lang.String serverId, java.security.PublicKey publicKey, javax.crypto.SecretKey secretKey)`
- `public static java.security.PublicKey decodePublicKey(byte[] encodedKey)`
- `public static javax.crypto.SecretKey decryptSharedKey(java.security.PrivateKey key, byte[] secretKeyEncrypted)`
- `public static byte[] encryptData(java.security.Key key, byte[] data)`
- `public static byte[] decryptData(java.security.Key key, byte[] data)`
- `public static javax.crypto.Cipher createNetCipherInstance(int opMode, java.security.Key key)`
