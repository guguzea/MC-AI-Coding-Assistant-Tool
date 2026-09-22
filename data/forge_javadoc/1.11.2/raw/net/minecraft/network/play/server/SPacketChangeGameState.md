---
title: "SPacketChangeGameState"
description: "public class SPacketChangeGameState extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketChangeGameState.html"
sourceType: javadoc
---

# SPacketChangeGameState

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketChangeGameState

## Class signature

```java
public class SPacketChangeGameState extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketChangeGameState()`
- `SPacketChangeGameState(int stateIn, float valueIn)`

## Methods

- `int getGameState()`
- `float getValue()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`

## Fields

- `static java.lang.String[] MESSAGE_NAMES`
