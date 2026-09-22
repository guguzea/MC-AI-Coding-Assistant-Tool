# CPacketChatMessage

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketChatMessage

## Class signature

```java
public class CPacketChatMessage extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketChatMessage()`
- `CPacketChatMessage(java.lang.String messageIn)`

## Methods

- `java.lang.String getMessage()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`