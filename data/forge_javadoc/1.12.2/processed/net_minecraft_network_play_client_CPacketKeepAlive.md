# CPacketKeepAlive

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketKeepAlive

## Class signature

```java
public class CPacketKeepAlive extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketKeepAlive()`
- `CPacketKeepAlive(long idIn)`

## Methods

- `long getKey()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`