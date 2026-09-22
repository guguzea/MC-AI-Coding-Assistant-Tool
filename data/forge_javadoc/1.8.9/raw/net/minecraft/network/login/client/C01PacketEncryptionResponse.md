---
title: "C01PacketEncryptionResponse"
description: "public class C01PacketEncryptionResponse extends java.lang.Object implements Packet<INetHandlerLoginServer>"
package: "net/minecraft/network/login/client"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/login/client/C01PacketEncryptionResponse.html"
sourceType: javadoc
---

# C01PacketEncryptionResponse

**Inheritance:** java.lang.Object → net.minecraft.network.login.client.C01PacketEncryptionResponse

## Class signature

```java
public class C01PacketEncryptionResponse extends java.lang.Object implements Packet<INetHandlerLoginServer>
```

## Constructors

- `C01PacketEncryptionResponse()`
- `C01PacketEncryptionResponse(javax.crypto.SecretKey secretKey, java.security.PublicKey publicKey, byte[] verifyToken)`

## Methods

- `javax.crypto.SecretKey getSecretKey(java.security.PrivateKey key)`
- `byte[] getVerifyToken(java.security.PrivateKey key)`
- `void processPacket(INetHandlerLoginServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
