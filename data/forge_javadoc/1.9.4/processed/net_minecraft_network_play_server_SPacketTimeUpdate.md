# SPacketTimeUpdate

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketTimeUpdate

## Class signature

```java
public class SPacketTimeUpdate extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketTimeUpdate()`
- `SPacketTimeUpdate(long totalWorldTimeIn, long worldTimeIn, boolean p_i46902_5_)`

## Methods

- `long getTotalWorldTime()`
- `long getWorldTime()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`