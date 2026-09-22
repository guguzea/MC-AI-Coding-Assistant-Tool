---
title: "SPacketSetExperience"
description: "public class SPacketSetExperience extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketSetExperience.html"
sourceType: javadoc
---

# SPacketSetExperience

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketSetExperience

## Class signature

```java
public class SPacketSetExperience extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketSetExperience()`
- `SPacketSetExperience(float experienceBarIn, int totalExperienceIn, int levelIn)`

## Methods

- `float getExperienceBar()`
- `int getLevel()`
- `int getTotalExperience()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
