---
title: "SPacketWindowProperty"
description: "public class SPacketWindowProperty extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketWindowProperty.html"
sourceType: javadoc
---

# SPacketWindowProperty

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketWindowProperty

## Class signature

```java
public class SPacketWindowProperty extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketWindowProperty()`
- `SPacketWindowProperty(int windowIdIn, int propertyIn, int valueIn)`

## Methods

- `int getProperty()`
- `int getValue()`
- `int getWindowId()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
