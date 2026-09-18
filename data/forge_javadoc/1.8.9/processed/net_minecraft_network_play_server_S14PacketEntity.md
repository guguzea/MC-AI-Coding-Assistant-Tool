# S14PacketEntity

## Class signature

```java
public class S14PacketEntity extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S14PacketEntity()`
- `public S14PacketEntity(int entityIdIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public java.lang.String toString()`
- `public Entity getEntity( World worldIn)`
- `public byte func_149062_c()`
- `public byte func_149061_d()`
- `public byte func_149064_e()`
- `public byte func_149066_f()`
- `public byte func_149063_g()`
- `public boolean func_149060_h()`
- `public boolean getOnGround()`

## Description

Passes this Packet on to the NetHandler for processing.