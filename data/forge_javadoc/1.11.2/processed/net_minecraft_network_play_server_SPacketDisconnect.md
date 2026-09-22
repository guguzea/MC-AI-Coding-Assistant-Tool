# SPacketDisconnect

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketDisconnect

## Class signature

```java
public class SPacketDisconnect extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketDisconnect()`
- `SPacketDisconnect(ITextComponent messageIn)`

## Methods

- `ITextComponent getReason()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`