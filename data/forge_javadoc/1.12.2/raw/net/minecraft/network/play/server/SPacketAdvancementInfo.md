---
title: "SPacketAdvancementInfo"
description: "public class SPacketAdvancementInfo extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketAdvancementInfo.html"
sourceType: javadoc
---

# SPacketAdvancementInfo

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketAdvancementInfo

## Class signature

```java
public class SPacketAdvancementInfo extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketAdvancementInfo()`
- `SPacketAdvancementInfo(boolean p_i47519_1_, java.util.Collection<Advancement> p_i47519_2_, java.util.Set<ResourceLocation> p_i47519_3_, java.util.Map<ResourceLocation, AdvancementProgress> p_i47519_4_)`

## Methods

- `java.util.Map<ResourceLocation, Advancement.Builder> getAdvancementsToAdd()`
- `java.util.Set<ResourceLocation> getAdvancementsToRemove()`
- `java.util.Map<ResourceLocation, AdvancementProgress> getProgressUpdates()`
- `boolean isFirstSync()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
