---
title: "FMLNetworkEvent.CustomPacketRegistrationEvent"
description: "Fired when the REGISTER/UNREGISTER for custom channels is received."
package: "net/minecraftforge/fml/common/network"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/network/FMLNetworkEvent.CustomPacketRegistrationEvent.html"
sourceType: javadoc
---

# FMLNetworkEvent.CustomPacketRegistrationEvent

## Constructors

- `public CustomPacketRegistrationEvent( NetworkManager manager, java.util.Set<java.lang.String> registrations, java.lang.String operation, Side side, java.lang.Class< S > type)`

## Methods

- `public com.google.common.collect.ImmutableSet<java.lang.String> getRegistrations()`
- `public java.lang.String getOperation()`
- `public Side getSide()`

## Description

Fired when the REGISTER/UNREGISTER for custom channels is received.
