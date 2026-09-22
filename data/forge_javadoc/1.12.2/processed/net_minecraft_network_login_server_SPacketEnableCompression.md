# SPacketEnableCompression

**Inheritance:** java.lang.Object → net.minecraft.network.login.server.SPacketEnableCompression

## Class signature

```java
public class SPacketEnableCompression extends java.lang.Object implements Packet<INetHandlerLoginClient>
```

## Constructors

- `SPacketEnableCompression()`
- `SPacketEnableCompression(int thresholdIn)`

## Methods

- `int getCompressionThreshold()`
- `void processPacket(INetHandlerLoginClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`