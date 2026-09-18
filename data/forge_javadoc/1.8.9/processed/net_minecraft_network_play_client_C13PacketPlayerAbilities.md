# C13PacketPlayerAbilities

## Class signature

```java
public class C13PacketPlayerAbilities extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public C13PacketPlayerAbilities()`
- `public C13PacketPlayerAbilities( PlayerCapabilities capabilities)`

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

## Description

Passes this Packet on to the NetHandler for processing.