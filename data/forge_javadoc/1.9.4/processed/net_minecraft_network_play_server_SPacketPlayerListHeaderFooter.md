# SPacketPlayerListHeaderFooter

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketPlayerListHeaderFooter

## Class signature

```java
public class SPacketPlayerListHeaderFooter extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketPlayerListHeaderFooter()`
- `SPacketPlayerListHeaderFooter(ITextComponent headerIn)`

## Methods

- `ITextComponent getFooter()`
- `ITextComponent getHeader()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`