# SPacketWindowProperty

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketWindowProperty

## Class signature

```java
public class SPacketWindowProperty extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketWindowProperty()`
- `SPacketWindowProperty(int windowIdIn, int propertyIn, int valueIn)`

## Methods

- `int getProperty()`
- `int getValue()`
- `int getWindowId()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`