---
title: "SPacketEncryptionRequest"
description: "public class SPacketEncryptionRequest extends java.lang.Object implements Packet<INetHandlerLoginClient>"
package: "net/minecraft/network/login/server"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/login/server/SPacketEncryptionRequest.html"
sourceType: javadoc
---

# SPacketEncryptionRequest

**Inheritance:** java.lang.Object → net.minecraft.network.login.server.SPacketEncryptionRequest

## Class signature

```java
public class SPacketEncryptionRequest extends java.lang.Object implements Packet<INetHandlerLoginClient>
```

## Constructors

- `SPacketEncryptionRequest()`
- `SPacketEncryptionRequest(java.lang.String serverIdIn, java.security.PublicKey publicKeyIn, byte[] verifyTokenIn)`

## Methods

- `java.security.PublicKey getPublicKey()`
- `java.lang.String getServerId()`
- `byte[] getVerifyToken()`
- `void processPacket(INetHandlerLoginClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
