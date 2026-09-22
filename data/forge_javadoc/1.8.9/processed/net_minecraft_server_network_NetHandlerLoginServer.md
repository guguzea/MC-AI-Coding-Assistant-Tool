# NetHandlerLoginServer

**Inheritance:** java.lang.Object → net.minecraft.server.network.NetHandlerLoginServer

## Class signature

```java
public class NetHandlerLoginServer extends java.lang.Object implements INetHandlerLoginServer, ITickable
```

## Constructors

- `NetHandlerLoginServer(MinecraftServer p_i45298_1_, NetworkManager p_i45298_2_)`

## Methods

- `void closeConnection(java.lang.String reason)`
- `java.lang.String getConnectionInfo()`
- `protected GameProfile getOfflineProfile(GameProfile original)`
- `void onDisconnect(IChatComponent reason)` — Invoked when disconnecting, the parameter is a ChatComponent describing the reason for termination
- `void processEncryptionResponse(C01PacketEncryptionResponse packetIn)`
- `void processLoginStart(C00PacketLoginStart packetIn)`
- `void tryAcceptPlayer()`
- `void update()` — Like the old updateEntity(), except more generic.

## Fields

- `NetworkManager networkManager`