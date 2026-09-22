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