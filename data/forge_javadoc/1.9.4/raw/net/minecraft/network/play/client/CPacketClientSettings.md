---
title: "CPacketClientSettings"
description: "public class CPacketClientSettings extends java.lang.Object implements Packet<INetHandlerPlayServer>"
package: "net/minecraft/network/play/client"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/client/CPacketClientSettings.html"
sourceType: javadoc
---

# CPacketClientSettings

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketClientSettings

## Class signature

```java
public class CPacketClientSettings extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketClientSettings()`
- `CPacketClientSettings(java.lang.String langIn, int renderDistanceIn, EntityPlayer.EnumChatVisibility chatVisibilityIn, boolean chatColorsIn, int modelPartsIn, EnumHandSide mainHandIn)`

## Methods

- `EntityPlayer.EnumChatVisibility getChatVisibility()`
- `java.lang.String getLang()`
- `EnumHandSide getMainHand()`
- `int getModelPartFlags()`
- `boolean isColorsEnabled()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
