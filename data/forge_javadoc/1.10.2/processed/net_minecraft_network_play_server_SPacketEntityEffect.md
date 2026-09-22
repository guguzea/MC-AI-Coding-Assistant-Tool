# SPacketEntityEffect

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketEntityEffect

## Class signature

```java
public class SPacketEntityEffect extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketEntityEffect()`
- `SPacketEntityEffect(int entityIdIn, PotionEffect effect)`

## Methods

- `boolean doesShowParticles()`
- `byte getAmplifier()`
- `int getDuration()`
- `byte getEffectId()`
- `int getEntityId()`
- `boolean getIsAmbient()`
- `boolean isMaxDuration()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`