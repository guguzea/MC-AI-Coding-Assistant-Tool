# C0FPacketConfirmTransaction

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.C0FPacketConfirmTransaction

## Class signature

```java
public class C0FPacketConfirmTransaction extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `C0FPacketConfirmTransaction()`
- `C0FPacketConfirmTransaction(int windowId, short uid, boolean accepted)`

## Methods

- `short getUid()`
- `int getWindowId()`
- `void processPacket(INetHandlerPlayServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.