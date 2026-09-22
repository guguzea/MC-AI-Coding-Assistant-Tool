---
title: "FMLNetworkEvent.CustomPacketRegistrationEvent"
description: "public static class FMLNetworkEvent.CustomPacketRegistrationEvent<S extends INetHandler> extends FMLNetworkEvent<S>"
package: "net/minecraftforge/fml/common/network"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/network/FMLNetworkEvent.CustomPacketRegistrationEvent.html"
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
- `<any> getRegistrations()`
- `Side getSide()`
