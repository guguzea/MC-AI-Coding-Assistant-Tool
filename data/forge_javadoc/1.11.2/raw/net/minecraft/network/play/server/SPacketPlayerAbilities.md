---
title: "SPacketPlayerAbilities"
description: "public class SPacketPlayerAbilities extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketPlayerAbilities.html"
sourceType: javadoc
---

# SPacketPlayerAbilities

## Class signature

```java
public class SPacketPlayerAbilities extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketPlayerAbilities()`
- `public SPacketPlayerAbilities( PlayerCapabilities capabilities)`

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
