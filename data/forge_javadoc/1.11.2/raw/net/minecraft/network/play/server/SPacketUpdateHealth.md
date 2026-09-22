---
title: "SPacketUpdateHealth"
description: "public class SPacketUpdateHealth extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketUpdateHealth.html"
sourceType: javadoc
---

# SPacketUpdateHealth

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketUpdateHealth

## Class signature

```java
public class SPacketUpdateHealth extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketUpdateHealth()`
- `SPacketUpdateHealth(float healthIn, int foodLevelIn, float saturationLevelIn)`

## Methods

- `int getFoodLevel()`
- `float getHealth()`
- `float getSaturationLevel()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
