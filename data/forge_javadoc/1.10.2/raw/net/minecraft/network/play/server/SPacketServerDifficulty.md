---
title: "SPacketServerDifficulty"
description: "public class SPacketServerDifficulty extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketServerDifficulty.html"
sourceType: javadoc
---

# SPacketServerDifficulty

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketServerDifficulty

## Class signature

```java
public class SPacketServerDifficulty extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketServerDifficulty()`
- `SPacketServerDifficulty(EnumDifficulty difficultyIn, boolean difficultyLockedIn)`

## Methods

- `EnumDifficulty getDifficulty()`
- `boolean isDifficultyLocked()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
