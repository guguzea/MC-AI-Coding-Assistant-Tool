---
title: "C0CPacketInput"
description: "public class C0CPacketInput extends java.lang.Object implements Packet<INetHandlerPlayServer>"
package: "net/minecraft/network/play/client"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/client/C0CPacketInput.html"
sourceType: javadoc
---

# C0CPacketInput

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.C0CPacketInput

## Class signature

```java
public class C0CPacketInput extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `C0CPacketInput()`
- `C0CPacketInput(float strafeSpeed, float forwardSpeed, boolean jumping, boolean sneaking)`

## Methods

- `float getForwardSpeed()`
- `float getStrafeSpeed()`
- `boolean isJumping()`
- `boolean isSneaking()`
- `void processPacket(INetHandlerPlayServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
