---
title: "SPacketSetExperience"
description: "public class SPacketSetExperience extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketSetExperience.html"
sourceType: javadoc
---

# SPacketSetExperience

## Class signature

```java
public class SPacketSetExperience extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketSetExperience()`
- `public SPacketSetExperience(float experienceBarIn, int totalExperienceIn, int levelIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public float getExperienceBar()`
- `public int getTotalExperience()`
- `public int getLevel()`
