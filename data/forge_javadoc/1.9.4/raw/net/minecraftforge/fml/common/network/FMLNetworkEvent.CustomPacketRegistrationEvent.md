---
title: "FMLNetworkEvent.CustomPacketRegistrationEvent"
description: "public static class FMLNetworkEvent.CustomPacketRegistrationEvent<S extends INetHandler> extends FMLNetworkEvent<S>"
package: "net/minecraftforge/fml/common/network"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/network/FMLNetworkEvent.CustomPacketRegistrationEvent.html"
sourceType: javadoc
---

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
