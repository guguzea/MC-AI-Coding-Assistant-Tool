# SPacketTabComplete

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketTabComplete

## Class signature

```java
public class SPacketTabComplete extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketTabComplete()`
- `SPacketTabComplete(java.lang.String[] matchesIn)`

## Methods

- `java.lang.String[] getMatches()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`