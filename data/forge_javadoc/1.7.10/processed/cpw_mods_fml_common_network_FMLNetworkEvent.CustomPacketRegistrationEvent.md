# FMLNetworkEvent.CustomPacketRegistrationEvent

**Inheritance:** java.lang.Object → cpw.mods.fml.common.eventhandler.Event → cpw.mods.fml.common.network.FMLNetworkEvent<S> → cpw.mods.fml.common.network.FMLNetworkEvent.CustomPacketRegistrationEvent<S>

## Class signature

```java
public static class FMLNetworkEvent.CustomPacketRegistrationEvent<S extends INetHandler> extends FMLNetworkEvent<S>
```

## Constructors

- `CustomPacketRegistrationEvent(NetworkManager manager, java.util.Set<java.lang.String> registrations, java.lang.String operation, Side side, java.lang.Class<S> type)`

## Fields

- `java.lang.String operation`
- `<any> registrations`
- `Side side`