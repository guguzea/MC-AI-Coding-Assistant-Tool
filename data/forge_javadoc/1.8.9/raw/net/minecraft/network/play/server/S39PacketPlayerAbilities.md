---
title: "S39PacketPlayerAbilities"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S39PacketPlayerAbilities.html"
sourceType: javadoc
---

# S39PacketPlayerAbilities

## Class signature

```java
public class S39PacketPlayerAbilities extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S39PacketPlayerAbilities()`
- `public S39PacketPlayerAbilities( PlayerCapabilities capabilities)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public boolean isInvulnerable()`
- `public void setInvulnerable(boolean isInvulnerable)`
- `public boolean isFlying()`
- `public void setFlying(boolean isFlying)`
- `public boolean isAllowFlying()`
- `public void setAllowFlying(boolean isAllowFlying)`
- `public boolean isCreativeMode()`
- `public void setCreativeMode(boolean isCreativeMode)`
- `public float getFlySpeed()`
- `public void setFlySpeed(float flySpeedIn)`
- `public float getWalkSpeed()`
- `public void setWalkSpeed(float walkSpeedIn)`

## Description

Passes this Packet on to the NetHandler for processing.
