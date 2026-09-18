# CryptManager

## Class signature

```java
public class CryptManager extends java.lang.Object
```

## Constructors

- `public CryptManager()`

## Methods

- `public static javax.crypto.SecretKey createNewSharedKey()`
- `public static java.security.KeyPair createNewKeyPair()`
- `public static byte[] getServerIdHash(java.lang.String p_75895_0_, java.security.PublicKey p_75895_1_, javax.crypto.SecretKey p_75895_2_)`
- `public static java.security.PublicKey decodePublicKey(byte[] p_75896_0_)`
- `public static javax.crypto.SecretKey decryptSharedKey(java.security.PrivateKey p_75887_0_, byte[] p_75887_1_)`
- `public static byte[] encryptData(java.security.Key p_75894_0_, byte[] p_75894_1_)`
- `public static byte[] decryptData(java.security.Key p_75889_0_, byte[] p_75889_1_)`
- `public static javax.crypto.Cipher func_151229_a(int p_151229_0_, java.security.Key p_151229_1_)`