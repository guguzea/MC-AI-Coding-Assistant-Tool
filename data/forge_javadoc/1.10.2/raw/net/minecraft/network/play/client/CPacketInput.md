---
title: "CPacketInput"
description: "public class CPacketInput extends java.lang.Object implements Packet < INetHandlerPlayServer >"
package: "net/minecraft/network/play/client"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/client/CPacketInput.html"
sourceType: javadoc
---

# CPacketInput

## Class signature

```java
public class CPacketInput extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketInput()`
- `public CPacketInput(float strafeSpeedIn, float forwardSpeedIn, boolean jumpingIn, boolean sneakingIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public float getStrafeSpeed()`
- `public float getForwardSpeed()`
- `public boolean isJumping()`
- `public boolean isSneaking()`
