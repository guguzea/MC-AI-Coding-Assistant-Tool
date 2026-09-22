# CPacketPing

**Inheritance:** java.lang.Object → net.minecraft.network.status.client.CPacketPing

## Class signature

```java
public class CPacketPing extends java.lang.Object implements Packet<INetHandlerStatusServer>
```

## Constructors

- `CPacketPing()`
- `CPacketPing(long clientTimeIn)`

## Methods

- `long getClientTime()`
- `void processPacket(INetHandlerStatusServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`