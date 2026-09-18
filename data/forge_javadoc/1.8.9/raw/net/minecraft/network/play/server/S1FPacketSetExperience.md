---
title: "S1FPacketSetExperience"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S1FPacketSetExperience.html"
sourceType: javadoc
---

# S1FPacketSetExperience

## Class signature

```java
public class S1FPacketSetExperience extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S1FPacketSetExperience()`
- `public S1FPacketSetExperience(float p_i45222_1_, int totalExperienceIn, int levelIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public float func_149397_c()`
- `public int getTotalExperience()`
- `public int getLevel()`

## Description

Passes this Packet on to the NetHandler for processing.
