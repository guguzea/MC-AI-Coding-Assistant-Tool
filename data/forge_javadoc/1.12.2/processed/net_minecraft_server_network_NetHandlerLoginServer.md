# NetHandlerLoginServer

**Inheritance:** java.lang.Object → net.minecraft.server.network.NetHandlerLoginServer

## Class signature

```java
public class NetHandlerLoginServer extends java.lang.Object implements INetHandlerLoginServer, ITickable
```

## Constructors

- `NetHandlerLoginServer(MinecraftServer serverIn, NetworkManager networkManagerIn)`

## Methods

- `void disconnect(ITextComponent reason)`
- `java.lang.String getConnectionInfo()`
- `protected GameProfile getOfflineProfile(GameProfile original)`
- `void onDisconnect(ITextComponent reason)`
- `void processEncryptionResponse(CPacketEncryptionResponse packetIn)`
- `void processLoginStart(CPacketLoginStart packetIn)`
- `void tryAcceptPlayer()`
- `void update()`

## Fields

- `NetworkManager networkManager`