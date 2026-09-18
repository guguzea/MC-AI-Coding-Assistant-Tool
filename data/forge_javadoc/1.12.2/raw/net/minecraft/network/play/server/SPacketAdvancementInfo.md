---
title: "SPacketAdvancementInfo"
description: "public class SPacketAdvancementInfo extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketAdvancementInfo.html"
sourceType: javadoc
---

# SPacketAdvancementInfo

## Class signature

```java
public class SPacketAdvancementInfo extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketAdvancementInfo()`
- `public SPacketAdvancementInfo(boolean p_i47519_1_, java.util.Collection< Advancement > p_i47519_2_, java.util.Set< ResourceLocation > p_i47519_3_, java.util.Map< ResourceLocation , AdvancementProgress > p_i47519_4_)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public java.util.Map< ResourceLocation , Advancement.Builder > getAdvancementsToAdd()`
- `public java.util.Set< ResourceLocation > getAdvancementsToRemove()`
- `public java.util.Map< ResourceLocation , AdvancementProgress > getProgressUpdates()`
- `public boolean isFirstSync()`
