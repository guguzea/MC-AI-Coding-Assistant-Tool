---
title: "S01PacketEncryptionRequest"
description: "public class S01PacketEncryptionRequest extends java.lang.Object implements Packet<INetHandlerLoginClient>"
package: "net/minecraft/network/login/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/login/server/S01PacketEncryptionRequest.html"
sourceType: javadoc
---

# S01PacketEncryptionRequest

**Inheritance:** java.lang.Object → net.minecraft.network.login.server.S01PacketEncryptionRequest

## Class signature

```java
public class S01PacketEncryptionRequest extends java.lang.Object implements Packet<INetHandlerLoginClient>
```

## Constructors

- `S01PacketEncryptionRequest()`
- `S01PacketEncryptionRequest(java.lang.String serverId, java.security.PublicKey key, byte[] verifyToken)`

## Methods

- `java.security.PublicKey getPublicKey()`
- `java.lang.String getServerId()`
- `byte[] getVerifyToken()`
- `void processPacket(INetHandlerLoginClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
