---
title: "CPacketEncryptionResponse"
description: "public class CPacketEncryptionResponse extends java.lang.Object implements Packet < INetHandlerLoginServer >"
package: "net/minecraft/network/login/client"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/login/client/CPacketEncryptionResponse.html"
sourceType: javadoc
---

# CPacketEncryptionResponse

## Class signature

```java
public class CPacketEncryptionResponse extends java.lang.Object implements Packet < INetHandlerLoginServer >
```

## Constructors

- `public CPacketEncryptionResponse()`
- `public CPacketEncryptionResponse(javax.crypto.SecretKey secret, java.security.PublicKey key, byte[] verifyToken)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerLoginServer handler)`
- `public javax.crypto.SecretKey getSecretKey(java.security.PrivateKey key)`
- `public byte[] getVerifyToken(java.security.PrivateKey key)`
