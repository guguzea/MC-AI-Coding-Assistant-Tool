---
title: "SPacketUpdateBossInfo"
description: "public class SPacketUpdateBossInfo extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketUpdateBossInfo.html"
sourceType: javadoc
---

# SPacketUpdateBossInfo

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketUpdateBossInfo

## Class signature

```java
public class SPacketUpdateBossInfo extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketUpdateBossInfo()`
- `SPacketUpdateBossInfo(SPacketUpdateBossInfo.Operation operationIn, BossInfo data)`

## Methods

- `BossInfo.Color getColor()`
- `ITextComponent getName()`
- `SPacketUpdateBossInfo.Operation getOperation()`
- `BossInfo.Overlay getOverlay()`
- `float getPercent()`
- `java.util.UUID getUniqueId()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `boolean shouldCreateFog()`
- `boolean shouldDarkenSky()`
- `boolean shouldPlayEndBossMusic()`
- `void writePacketData(PacketBuffer buf)`
