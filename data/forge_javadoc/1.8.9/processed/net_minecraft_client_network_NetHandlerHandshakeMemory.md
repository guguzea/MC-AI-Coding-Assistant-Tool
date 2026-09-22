# NetHandlerHandshakeMemory

**Inheritance:** java.lang.Object → net.minecraft.client.network.NetHandlerHandshakeMemory

## Class signature

```java
public class NetHandlerHandshakeMemory extends java.lang.Object implements INetHandlerHandshakeServer
```

## Constructors

- `NetHandlerHandshakeMemory(MinecraftServer p_i45287_1_, NetworkManager p_i45287_2_)`

## Methods

- `void onDisconnect(IChatComponent reason)` — Invoked when disconnecting, the parameter is a ChatComponent describing the reason for termination
- `void processHandshake(C00Handshake packetIn)` — There are two recognized intentions for initiating a handshake: logging in and acquiring server status.