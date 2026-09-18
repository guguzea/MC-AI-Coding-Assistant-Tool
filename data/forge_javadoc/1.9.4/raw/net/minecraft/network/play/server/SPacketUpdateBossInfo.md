---
title: "SPacketUpdateBossInfo"
description: "public class SPacketUpdateBossInfo extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketUpdateBossInfo.html"
sourceType: javadoc
---

# SPacketUpdateBossInfo

## Class signature

```java
public class SPacketUpdateBossInfo extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketUpdateBossInfo()`
- `public SPacketUpdateBossInfo( SPacketUpdateBossInfo.Operation operationIn, BossInfo data)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public java.util.UUID getUniqueId()`
- `public SPacketUpdateBossInfo.Operation getOperation()`
- `public ITextComponent getName()`
- `public float getPercent()`
- `public BossInfo.Color getColor()`
- `public BossInfo.Overlay getOverlay()`
- `public boolean shouldDarkenSky()`
- `public boolean shouldPlayEndBossMusic()`
- `public boolean shouldCreateFog()`
