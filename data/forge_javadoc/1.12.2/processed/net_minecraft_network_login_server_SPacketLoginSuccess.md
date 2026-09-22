# SPacketLoginSuccess

**Inheritance:** java.lang.Object → net.minecraft.network.login.server.SPacketLoginSuccess

## Class signature

```java
public class SPacketLoginSuccess extends java.lang.Object implements Packet<INetHandlerLoginClient>
```

## Constructors

- `SPacketLoginSuccess()`
- `SPacketLoginSuccess(GameProfile profileIn)`

## Methods

- `GameProfile getProfile()`
- `void processPacket(INetHandlerLoginClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`