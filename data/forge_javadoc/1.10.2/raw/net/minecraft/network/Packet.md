---
title: "Packet"
description: "public interface Packet<T extends INetHandler>"
package: "net/minecraft/network"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/Packet.html"
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
