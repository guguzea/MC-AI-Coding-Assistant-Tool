# SPacketEntityEffect

## Class signature

```java
public class SPacketEntityEffect extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketEntityEffect()`
- `public SPacketEntityEffect(int entityIdIn, PotionEffect effect)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public boolean isMaxDuration()`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityId()`
- `public byte getEffectId()`
- `public byte getAmplifier()`
- `public int getDuration()`
- `public boolean doesShowParticles()`
- `public boolean getIsAmbient()`