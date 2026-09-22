# SPacketUnloadChunk

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketUnloadChunk

## Class signature

```java
public class SPacketUnloadChunk extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketUnloadChunk()`
- `SPacketUnloadChunk(int xIn, int zIn)`

## Methods

- `int getX()`
- `int getZ()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`