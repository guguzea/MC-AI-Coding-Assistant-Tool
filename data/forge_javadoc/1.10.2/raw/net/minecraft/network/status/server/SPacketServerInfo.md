---
title: "SPacketServerInfo"
description: "public class SPacketServerInfo extends java.lang.Object implements Packet < INetHandlerStatusClient >"
package: "net/minecraft/network/status/server"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/status/server/SPacketServerInfo.html"
sourceType: javadoc
---

# SPacketServerInfo

## Class signature

```java
public class SPacketServerInfo extends java.lang.Object implements Packet < INetHandlerStatusClient >
```

## Constructors

- `public SPacketServerInfo()`
- `public SPacketServerInfo( ServerStatusResponse responseIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerStatusClient handler)`
- `public ServerStatusResponse getResponse()`
