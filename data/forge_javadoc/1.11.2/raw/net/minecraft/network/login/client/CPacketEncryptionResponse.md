---
title: "CPacketEncryptionResponse"
description: "public class CPacketEncryptionResponse extends java.lang.Object implements Packet<INetHandlerLoginServer>"
package: "net/minecraft/network/login/client"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/login/client/CPacketEncryptionResponse.html"
sourceType: javadoc
---

# CPacketEncryptionResponse

**Inheritance:** java.lang.Object → net.minecraft.network.login.client.CPacketEncryptionResponse

## Class signature

```java
public class CPacketEncryptionResponse extends java.lang.Object implements Packet<INetHandlerLoginServer>
```

## Constructors

- `CPacketEncryptionResponse()`
- `CPacketEncryptionResponse(javax.crypto.SecretKey secret, java.security.PublicKey key, byte[] verifyToken)`

## Methods

- `javax.crypto.SecretKey getSecretKey(java.security.PrivateKey key)`
- `byte[] getVerifyToken(java.security.PrivateKey key)`
- `void processPacket(INetHandlerLoginServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
