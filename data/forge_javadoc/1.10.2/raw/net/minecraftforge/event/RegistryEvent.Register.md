---
title: "RegistryEvent.Register"
description: "Register your objects for the appropriate registry type when you receive this event. event.getRegistry().register(...) The registries will be visited in alphabetic order of their name, except blocks a"
package: "net/minecraftforge/event"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/event/RegistryEvent.Register.html"
sourceType: javadoc
---

# RegistryEvent.Register

## Constructors

- `public Register( ResourceLocation location, IForgeRegistry < T > registry)`

## Methods

- `public IForgeRegistry < T > getRegistry()`
- `public ResourceLocation getLocation()`

## Description

Register your objects for the appropriate registry type when you receive this event. event.getRegistry().register(...) The registries will be visited in alphabetic order of their name, except blocks a
