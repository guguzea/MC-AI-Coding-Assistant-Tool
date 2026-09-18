---
title: "SPacketDisconnect"
description: "public class SPacketDisconnect extends java.lang.Object implements Packet < INetHandlerLoginClient >"
package: "net/minecraft/network/login/server"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/login/server/SPacketDisconnect.html"
sourceType: javadoc
---

# SPacketDisconnect

## Class signature

```java
public class SPacketDisconnect extends java.lang.Object implements Packet < INetHandlerLoginClient >
```

## Constructors

- `public SPacketDisconnect()`
- `public SPacketDisconnect( ITextComponent p_i46853_1_)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerLoginClient handler)`
- `public ITextComponent getReason()`
