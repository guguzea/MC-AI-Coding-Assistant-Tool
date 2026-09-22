# S2EPacketCloseWindow

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S2EPacketCloseWindow

## Class signature

```java
public class S2EPacketCloseWindow extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S2EPacketCloseWindow()`
- `S2EPacketCloseWindow(int windowIdIn)`

## Methods

- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.