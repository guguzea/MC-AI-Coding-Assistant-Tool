---
title: "C01PacketEncryptionResponse"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/login/client"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/login/client/C01PacketEncryptionResponse.html"
sourceType: javadoc
---

# C01PacketEncryptionResponse

## Class signature

```java
public class C01PacketEncryptionResponse extends java.lang.Object implements Packet < INetHandlerLoginServer >
```

## Constructors

- `public C01PacketEncryptionResponse()`
- `public C01PacketEncryptionResponse(javax.crypto.SecretKey secretKey, java.security.PublicKey publicKey, byte[] verifyToken)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerLoginServer handler)`
- `public javax.crypto.SecretKey getSecretKey(java.security.PrivateKey key)`
- `public byte[] getVerifyToken(java.security.PrivateKey key)`

## Description

Passes this Packet on to the NetHandler for processing.
