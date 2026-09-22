# SPacketResourcePackSend

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketResourcePackSend

## Class signature

```java
public class SPacketResourcePackSend extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketResourcePackSend()`
- `SPacketResourcePackSend(java.lang.String urlIn, java.lang.String hashIn)`

## Methods

- `java.lang.String getHash()`
- `java.lang.String getURL()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`