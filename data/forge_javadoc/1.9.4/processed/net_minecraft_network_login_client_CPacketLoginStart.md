# CPacketLoginStart

**Inheritance:** java.lang.Object → net.minecraft.network.login.client.CPacketLoginStart

## Class signature

```java
public class CPacketLoginStart extends java.lang.Object implements Packet<INetHandlerLoginServer>
```

## Constructors

- `CPacketLoginStart()`
- `CPacketLoginStart(com.mojang.authlib.GameProfile profileIn)`

## Methods

- `com.mojang.authlib.GameProfile getProfile()`
- `void processPacket(INetHandlerLoginServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`