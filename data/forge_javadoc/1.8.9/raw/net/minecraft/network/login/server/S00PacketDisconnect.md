---
title: "S00PacketDisconnect"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/login/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/login/server/S00PacketDisconnect.html"
sourceType: javadoc
---

# S00PacketDisconnect

## Class signature

```java
public class S00PacketDisconnect extends java.lang.Object implements Packet < INetHandlerLoginClient >
```

## Constructors

- `public S00PacketDisconnect()`
- `public S00PacketDisconnect( IChatComponent reasonIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerLoginClient handler)`
- `public IChatComponent func_149603_c()`

## Description

Passes this Packet on to the NetHandler for processing.
