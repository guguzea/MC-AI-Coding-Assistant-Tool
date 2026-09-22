# SPacketTitle

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketTitle

## Class signature

```java
public class SPacketTitle extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketTitle()`
- `SPacketTitle(int fadeInTimeIn, int displayTimeIn, int fadeOutTimeIn)`
- `SPacketTitle(SPacketTitle.Type typeIn, ITextComponent messageIn)`
- `SPacketTitle(SPacketTitle.Type typeIn, ITextComponent messageIn, int fadeInTimeIn, int displayTimeIn, int fadeOutTimeIn)`

## Methods

- `int getDisplayTime()`
- `int getFadeInTime()`
- `int getFadeOutTime()`
- `ITextComponent getMessage()`
- `SPacketTitle.Type getType()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`