# C00PacketKeepAlive

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.C00PacketKeepAlive

## Class signature

```java
public class C00PacketKeepAlive extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `C00PacketKeepAlive()`
- `C00PacketKeepAlive(int key)`

## Methods

- `int getKey()`
- `void processPacket(INetHandlerPlayServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.