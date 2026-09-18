---
title: "S42PacketCombatEvent"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S42PacketCombatEvent.html"
sourceType: javadoc
---

# S42PacketCombatEvent

## Class signature

```java
public class S42PacketCombatEvent extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S42PacketCombatEvent()`
- `public S42PacketCombatEvent( CombatTracker combatTrackerIn, S42PacketCombatEvent.Event combatEventType)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`

## Description

Passes this Packet on to the NetHandler for processing.
