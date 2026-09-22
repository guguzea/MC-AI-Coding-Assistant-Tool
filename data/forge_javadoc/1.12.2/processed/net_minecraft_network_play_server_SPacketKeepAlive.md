# SPacketKeepAlive

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketKeepAlive

## Class signature

```java
public class SPacketKeepAlive extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketKeepAlive()`
- `SPacketKeepAlive(long idIn)`

## Methods

- `long getId()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`