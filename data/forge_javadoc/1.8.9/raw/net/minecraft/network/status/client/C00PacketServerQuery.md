---
title: "C00PacketServerQuery"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/status/client"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/status/client/C00PacketServerQuery.html"
sourceType: javadoc
---

# C00PacketServerQuery

## Class signature

```java
public class C00PacketServerQuery extends java.lang.Object implements Packet < INetHandlerStatusServer >
```

## Constructors

- `public C00PacketServerQuery()`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerStatusServer handler)`

## Description

Passes this Packet on to the NetHandler for processing.
