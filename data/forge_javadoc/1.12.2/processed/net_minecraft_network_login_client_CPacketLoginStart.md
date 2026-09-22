# CPacketLoginStart

**Inheritance:** java.lang.Object → net.minecraft.network.login.client.CPacketLoginStart

## Class signature

```java
public class CPacketLoginStart extends java.lang.Object implements Packet<INetHandlerLoginServer>
```

## Constructors

- `CPacketLoginStart()`
- `CPacketLoginStart(GameProfile profileIn)`

## Methods

- `GameProfile getProfile()`
- `void processPacket(INetHandlerLoginServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`