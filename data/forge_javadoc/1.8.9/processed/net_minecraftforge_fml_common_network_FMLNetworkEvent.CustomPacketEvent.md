# FMLNetworkEvent.CustomPacketEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.fml.common.network.FMLNetworkEvent<S> → net.minecraftforge.fml.common.network.FMLNetworkEvent.CustomPacketEvent<S>

## Class signature

```java
public abstract static class FMLNetworkEvent.CustomPacketEvent<S extends INetHandler> extends FMLNetworkEvent<S>
```

## Methods

- `abstract Side side()`

## Fields

- `FMLProxyPacket packet` — The packet that generated the event
- `FMLProxyPacket reply` — Set this packet to reply to the originator