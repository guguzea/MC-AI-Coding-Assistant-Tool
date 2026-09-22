# NetHandlerStatusServer

**Inheritance:** java.lang.Object → net.minecraft.server.network.NetHandlerStatusServer

## Class signature

```java
public class NetHandlerStatusServer extends java.lang.Object implements INetHandlerStatusServer
```

## Constructors

- `NetHandlerStatusServer(MinecraftServer p_i45299_1_, NetworkManager p_i45299_2_)`

## Methods

- `void onConnectionStateTransition(EnumConnectionState p_147232_1_, EnumConnectionState p_147232_2_)`
- `void onDisconnect(IChatComponent p_147231_1_)`
- `void onNetworkTick()`
- `void processPing(C01PacketPing p_147311_1_)`
- `void processServerQuery(C00PacketServerQuery p_147312_1_)`