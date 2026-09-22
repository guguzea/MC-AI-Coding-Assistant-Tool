# SPacketConfirmTransaction

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketConfirmTransaction

## Class signature

```java
public class SPacketConfirmTransaction extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketConfirmTransaction()`
- `SPacketConfirmTransaction(int windowIdIn, short actionNumberIn, boolean acceptedIn)`

## Methods

- `short getActionNumber()`
- `int getWindowId()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `boolean wasAccepted()`
- `void writePacketData(PacketBuffer buf)`