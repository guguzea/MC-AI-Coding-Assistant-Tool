# SPacketSoundEffect

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketSoundEffect

## Class signature

```java
public class SPacketSoundEffect extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketSoundEffect()`
- `SPacketSoundEffect(SoundEvent soundIn, SoundCategory categoryIn, double xIn, double yIn, double zIn, float volumeIn, float pitchIn)`

## Methods

- `SoundCategory getCategory()`
- `float getPitch()`
- `SoundEvent getSound()`
- `float getVolume()`
- `double getX()`
- `double getY()`
- `double getZ()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`