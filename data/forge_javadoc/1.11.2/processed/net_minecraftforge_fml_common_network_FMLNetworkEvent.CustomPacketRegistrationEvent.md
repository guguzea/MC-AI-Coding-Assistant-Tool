# FMLNetworkEvent.CustomPacketRegistrationEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.fml.common.network.FMLNetworkEvent<S> → net.minecraftforge.fml.common.network.FMLNetworkEvent.CustomPacketRegistrationEvent<S>

## Class signature

```java
public static class FMLNetworkEvent.CustomPacketRegistrationEvent<S extends INetHandler> extends FMLNetworkEvent<S>
```

## Constructors

- `CustomPacketRegistrationEvent(NetworkManager manager, java.util.Set<java.lang.String> registrations, java.lang.String operation, Side side, java.lang.Class<S> type)`

## Methods

- `java.lang.String getOperation()`
- `com.google.common.collect.ImmutableSet<java.lang.String> getRegistrations()`
- `Side getSide()`