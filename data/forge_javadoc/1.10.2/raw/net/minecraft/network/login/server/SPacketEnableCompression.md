---
title: "SPacketEnableCompression"
description: "public class SPacketEnableCompression extends java.lang.Object implements Packet < INetHandlerLoginClient >"
package: "net/minecraft/network/login/server"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/login/server/SPacketEnableCompression.html"
sourceType: javadoc
---

# SPacketEnableCompression

## Class signature

```java
public class SPacketEnableCompression extends java.lang.Object implements Packet < INetHandlerLoginClient >
```

## Constructors

- `public SPacketEnableCompression()`
- `public SPacketEnableCompression(int thresholdIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerLoginClient handler)`
- `public int getCompressionThreshold()`
