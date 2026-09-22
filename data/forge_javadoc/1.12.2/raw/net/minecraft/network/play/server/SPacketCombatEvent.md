---
title: "SPacketCombatEvent"
description: "public class SPacketCombatEvent extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketCombatEvent.html"
sourceType: javadoc
---

# SPacketCombatEvent

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketCombatEvent

## Class signature

```java
public class SPacketCombatEvent extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketCombatEvent()`
- `SPacketCombatEvent(CombatTracker tracker, SPacketCombatEvent.Event eventIn)`
- `SPacketCombatEvent(CombatTracker tracker, SPacketCombatEvent.Event eventIn, boolean showDeathMessage)`

## Methods

- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`

## Fields

- `ITextComponent deathMessage`
- `int duration`
- `int entityId`
- `SPacketCombatEvent.Event eventType`
- `int playerId`
