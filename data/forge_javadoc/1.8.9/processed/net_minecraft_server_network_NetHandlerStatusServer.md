# NetHandlerStatusServer

**Inheritance:** java.lang.Object → net.minecraft.server.network.NetHandlerStatusServer

## Class signature

```java
public class NetHandlerStatusServer extends java.lang.Object implements INetHandlerStatusServer
```

## Constructors

- `NetHandlerStatusServer(MinecraftServer serverIn, NetworkManager netManager)`

## Methods

- `void onDisconnect(IChatComponent reason)` — Invoked when disconnecting, the parameter is a ChatComponent describing the reason for termination
- `void processPing(C01PacketPing packetIn)`
- `void processServerQuery(C00PacketServerQuery packetIn)`