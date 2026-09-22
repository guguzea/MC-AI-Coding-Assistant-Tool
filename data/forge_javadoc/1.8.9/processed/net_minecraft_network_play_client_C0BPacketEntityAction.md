# C0BPacketEntityAction

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.C0BPacketEntityAction

## Class signature

```java
public class C0BPacketEntityAction extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `C0BPacketEntityAction()`
- `C0BPacketEntityAction(Entity entity, C0BPacketEntityAction.Action action)`
- `C0BPacketEntityAction(Entity entity, C0BPacketEntityAction.Action action, int auxData)`

## Methods

- `C0BPacketEntityAction.Action getAction()`
- `int getAuxData()`
- `void processPacket(INetHandlerPlayServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.