# NetHandlerHandshakeTCP

**Inheritance:** java.lang.Object → net.minecraft.server.network.NetHandlerHandshakeTCP

## Class signature

```java
public class NetHandlerHandshakeTCP extends java.lang.Object implements INetHandlerHandshakeServer
```

## Constructors

- `NetHandlerHandshakeTCP(MinecraftServer serverIn, NetworkManager netManager)`

## Methods

- `void onDisconnect(IChatComponent reason)` — Invoked when disconnecting, the parameter is a ChatComponent describing the reason for termination
- `void processHandshake(C00Handshake packetIn)` — There are two recognized intentions for initiating a handshake: logging in and acquiring server status.