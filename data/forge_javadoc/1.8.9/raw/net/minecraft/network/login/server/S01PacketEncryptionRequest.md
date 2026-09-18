---
title: "S01PacketEncryptionRequest"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/login/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/login/server/S01PacketEncryptionRequest.html"
sourceType: javadoc
---

# S01PacketEncryptionRequest

## Class signature

```java
public class S01PacketEncryptionRequest extends java.lang.Object implements Packet < INetHandlerLoginClient >
```

## Constructors

- `public S01PacketEncryptionRequest()`
- `public S01PacketEncryptionRequest(java.lang.String serverId, java.security.PublicKey key, byte[] verifyToken)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerLoginClient handler)`
- `public java.lang.String getServerId()`
- `public java.security.PublicKey getPublicKey()`
- `public byte[] getVerifyToken()`

## Description

Passes this Packet on to the NetHandler for processing.
