---
title: "S00PacketServerInfo"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/status/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/status/server/S00PacketServerInfo.html"
sourceType: javadoc
---

# S00PacketServerInfo

## Class signature

```java
public class S00PacketServerInfo extends java.lang.Object implements Packet < INetHandlerStatusClient >
```

## Constructors

- `public S00PacketServerInfo()`
- `public S00PacketServerInfo( ServerStatusResponse responseIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerStatusClient handler)`
- `public ServerStatusResponse getResponse()`

## Description

Passes this Packet on to the NetHandler for processing.
