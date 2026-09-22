# S32PacketConfirmTransaction

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S32PacketConfirmTransaction

## Class signature

```java
public class S32PacketConfirmTransaction extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S32PacketConfirmTransaction()`
- `S32PacketConfirmTransaction(int windowIdIn, short actionNumberIn, boolean p_i45182_3_)`

## Methods

- `boolean func_148888_e()`
- `short getActionNumber()`
- `int getWindowId()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.