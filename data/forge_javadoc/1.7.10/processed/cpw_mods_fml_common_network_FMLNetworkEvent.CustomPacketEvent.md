# FMLNetworkEvent.CustomPacketEvent

**Inheritance:** java.lang.Object → cpw.mods.fml.common.eventhandler.Event → cpw.mods.fml.common.network.FMLNetworkEvent<S> → cpw.mods.fml.common.network.FMLNetworkEvent.CustomPacketEvent<S>

## Class signature

```java
public abstract static class FMLNetworkEvent.CustomPacketEvent<S extends INetHandler> extends FMLNetworkEvent<S>
```

## Methods

- `abstract Side side()`

## Fields

- `FMLProxyPacket packet` — The packet that generated the event
- `FMLProxyPacket reply` — Set this packet to reply to the originator