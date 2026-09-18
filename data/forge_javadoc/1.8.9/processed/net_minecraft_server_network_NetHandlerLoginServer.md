# NetHandlerLoginServer

## Class signature

```java
public class NetHandlerLoginServer extends java.lang.Object implements INetHandlerLoginServer , ITickable
```

## Constructors

- `public NetHandlerLoginServer( MinecraftServer p_i45298_1_, NetworkManager p_i45298_2_)`

## Methods

- `public void update()`
- `public void closeConnection(java.lang.String reason)`
- `public void tryAcceptPlayer()`
- `public void onDisconnect( IChatComponent reason)`
- `public java.lang.String getConnectionInfo()`
- `public void processLoginStart( C00PacketLoginStart packetIn)`
- `public void processEncryptionResponse( C01PacketEncryptionResponse packetIn)`
- `protected GameProfile getOfflineProfile(GameProfile original)`

## Description

Invoked when disconnecting, the parameter is a ChatComponent describing the reason for termination