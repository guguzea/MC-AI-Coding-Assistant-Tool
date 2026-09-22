# SPacketPong

**Inheritance:** java.lang.Object → net.minecraft.network.status.server.SPacketPong

## Class signature

```java
public class SPacketPong extends java.lang.Object implements Packet<INetHandlerStatusClient>
```

## Constructors

- `SPacketPong()`
- `SPacketPong(long clientTimeIn)`

## Methods

- `void processPacket(INetHandlerStatusClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`