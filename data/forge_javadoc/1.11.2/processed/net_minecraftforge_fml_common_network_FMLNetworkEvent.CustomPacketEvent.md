# FMLNetworkEvent.CustomPacketEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.fml.common.network.FMLNetworkEvent<S> → net.minecraftforge.fml.common.network.FMLNetworkEvent.CustomPacketEvent<S>

## Class signature

```java
public abstract static class FMLNetworkEvent.CustomPacketEvent<S extends INetHandler> extends FMLNetworkEvent<S>
```

## Methods

- `FMLProxyPacket getPacket()` — The packet that generated the event
- `FMLProxyPacket getReply()` — Set this packet to reply to the originator
- `void setReply(FMLProxyPacket reply)`
- `abstract Side side()`