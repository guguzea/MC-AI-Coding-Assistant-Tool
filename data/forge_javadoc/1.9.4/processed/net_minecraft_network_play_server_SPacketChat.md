# SPacketChat

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketChat

## Class signature

```java
public class SPacketChat extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketChat()`
- `SPacketChat(ITextComponent componentIn)`
- `SPacketChat(ITextComponent componentIn, byte typeIn)`

## Methods

- `ITextComponent getChatComponent()`
- `byte getType()`
- `boolean isSystem()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`