---
title: "Packet"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/Packet.html"
sourceType: javadoc
---

# Packet

## Class signature

```java
public interface Packet<T extends INetHandler >
```

## Methods

- `void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `void processPacket( T handler)`

## Description

Passes this Packet on to the NetHandler for processing.
