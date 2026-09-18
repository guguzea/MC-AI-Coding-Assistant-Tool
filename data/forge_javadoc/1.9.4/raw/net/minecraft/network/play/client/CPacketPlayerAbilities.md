---
title: "CPacketPlayerAbilities"
description: "public class CPacketPlayerAbilities extends java.lang.Object implements Packet < INetHandlerPlayServer >"
package: "net/minecraft/network/play/client"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/client/CPacketPlayerAbilities.html"
sourceType: javadoc
---

# CPacketPlayerAbilities

## Class signature

```java
public class CPacketPlayerAbilities extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketPlayerAbilities()`
- `public CPacketPlayerAbilities( PlayerCapabilities capabilities)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public boolean isInvulnerable()`
- `public void setInvulnerable(boolean isInvulnerable)`
- `public boolean isFlying()`
- `public void setFlying(boolean isFlying)`
- `public boolean isAllowFlying()`
- `public void setAllowFlying(boolean isAllowFlying)`
- `public boolean isCreativeMode()`
- `public void setCreativeMode(boolean isCreativeMode)`
- `public void setFlySpeed(float flySpeedIn)`
- `public void setWalkSpeed(float walkSpeedIn)`
