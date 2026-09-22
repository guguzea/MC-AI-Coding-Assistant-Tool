# S29PacketSoundEffect

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S29PacketSoundEffect

## Class signature

```java
public class S29PacketSoundEffect extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S29PacketSoundEffect()`
- `S29PacketSoundEffect(java.lang.String soundNameIn, double soundX, double soundY, double soundZ, float volume, float pitch)`

## Methods

- `float getPitch()`
- `java.lang.String getSoundName()`
- `float getVolume()`
- `double getX()`
- `double getY()`
- `double getZ()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.