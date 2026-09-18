---
title: "SPacketEncryptionRequest"
description: "public class SPacketEncryptionRequest extends java.lang.Object implements Packet < INetHandlerLoginClient >"
package: "net/minecraft/network/login/server"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/login/server/SPacketEncryptionRequest.html"
sourceType: javadoc
---

# SPacketEncryptionRequest

## Class signature

```java
public class SPacketEncryptionRequest extends java.lang.Object implements Packet < INetHandlerLoginClient >
```

## Constructors

- `public SPacketEncryptionRequest()`
- `public SPacketEncryptionRequest(java.lang.String serverIdIn, java.security.PublicKey publicKeyIn, byte[] verifyTokenIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerLoginClient handler)`
- `public java.lang.String getServerId()`
- `public java.security.PublicKey getPublicKey()`
- `public byte[] getVerifyToken()`
