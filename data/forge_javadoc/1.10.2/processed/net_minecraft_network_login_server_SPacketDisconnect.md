# SPacketDisconnect

**Inheritance:** java.lang.Object → net.minecraft.network.login.server.SPacketDisconnect

## Class signature

```java
public class SPacketDisconnect extends java.lang.Object implements Packet<INetHandlerLoginClient>
```

## Constructors

- `SPacketDisconnect()`
- `SPacketDisconnect(ITextComponent p_i46853_1_)`

## Methods

- `ITextComponent getReason()`
- `void processPacket(INetHandlerLoginClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`