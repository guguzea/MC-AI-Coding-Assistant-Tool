# NetHandlerStatusServer

**Inheritance:** java.lang.Object → net.minecraft.server.network.NetHandlerStatusServer

## Class signature

```java
public class NetHandlerStatusServer extends java.lang.Object implements INetHandlerStatusServer
```

## Constructors

- `NetHandlerStatusServer(MinecraftServer serverIn, NetworkManager netManager)`

## Methods

- `void onDisconnect(ITextComponent reason)`
- `void processPing(CPacketPing packetIn)`
- `void processServerQuery(CPacketServerQuery packetIn)`