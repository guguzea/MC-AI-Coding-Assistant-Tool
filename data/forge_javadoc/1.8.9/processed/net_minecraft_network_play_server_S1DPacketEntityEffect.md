# S1DPacketEntityEffect

## Class signature

```java
public class S1DPacketEntityEffect extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S1DPacketEntityEffect()`
- `public S1DPacketEntityEffect(int entityIdIn, PotionEffect effect)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public boolean func_149429_c()`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityId()`
- `public byte getEffectId()`
- `public byte getAmplifier()`
- `public int getDuration()`
- `public boolean func_179707_f()`

## Description

Passes this Packet on to the NetHandler for processing.