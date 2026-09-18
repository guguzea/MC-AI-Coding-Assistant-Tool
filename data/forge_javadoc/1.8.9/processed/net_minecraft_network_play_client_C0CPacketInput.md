# C0CPacketInput

## Class signature

```java
public class C0CPacketInput extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public C0CPacketInput()`
- `public C0CPacketInput(float strafeSpeed, float forwardSpeed, boolean jumping, boolean sneaking)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public float getStrafeSpeed()`
- `public float getForwardSpeed()`
- `public boolean isJumping()`
- `public boolean isSneaking()`

## Description

Passes this Packet on to the NetHandler for processing.