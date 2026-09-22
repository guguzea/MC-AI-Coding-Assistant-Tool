# CPacketConfirmTransaction

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketConfirmTransaction

## Class signature

```java
public class CPacketConfirmTransaction extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketConfirmTransaction()`
- `CPacketConfirmTransaction(int windowIdIn, short uidIn, boolean acceptedIn)`

## Methods

- `short getUid()`
- `int getWindowId()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`