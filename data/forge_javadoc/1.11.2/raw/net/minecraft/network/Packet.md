---
title: "Packet"
description: "public interface Packet<T extends INetHandler>"
package: "net/minecraft/network"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/Packet.html"
sourceType: javadoc
---

# Packet

## Class signature

```java
public interface Packet<T extends INetHandler>
```

## Methods

- `void processPacket(T handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
