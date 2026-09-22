---
title: "S08PacketPlayerPosLook"
description: "public class S08PacketPlayerPosLook extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S08PacketPlayerPosLook.html"
sourceType: javadoc
---

# S08PacketPlayerPosLook

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S08PacketPlayerPosLook

## Class signature

```java
public class S08PacketPlayerPosLook extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S08PacketPlayerPosLook()`
- `S08PacketPlayerPosLook(double xIn, double yIn, double zIn, float yawIn, float pitchIn, java.util.Set<S08PacketPlayerPosLook.EnumFlags> p_i45993_9_)`

## Methods

- `java.util.Set<S08PacketPlayerPosLook.EnumFlags> func_179834_f()`
- `float getPitch()`
- `double getX()`
- `double getY()`
- `float getYaw()`
- `double getZ()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
