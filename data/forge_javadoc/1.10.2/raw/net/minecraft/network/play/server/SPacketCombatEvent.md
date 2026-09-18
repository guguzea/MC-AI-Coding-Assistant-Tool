---
title: "SPacketCombatEvent"
description: "public class SPacketCombatEvent extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketCombatEvent.html"
sourceType: javadoc
---

# SPacketCombatEvent

## Class signature

```java
public class SPacketCombatEvent extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketCombatEvent()`
- `public SPacketCombatEvent( CombatTracker tracker, SPacketCombatEvent.Event eventIn)`
- `public SPacketCombatEvent( CombatTracker tracker, SPacketCombatEvent.Event eventIn, boolean p_i46932_3_)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
