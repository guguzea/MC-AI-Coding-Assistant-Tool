---
title: "RegistryEvent.Register"
description: "public static class RegistryEvent.Register<T extends IForgeRegistryEntry<T>> extends RegistryEvent<T>"
package: "net/minecraftforge/event"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/event/RegistryEvent.Register.html"
sourceType: javadoc
---

# RegistryEvent.Register

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.fml.common.eventhandler.GenericEvent<T> → net.minecraftforge.event.RegistryEvent<T> → net.minecraftforge.event.RegistryEvent.Register<T>

## Class signature

```java
public static class RegistryEvent.Register<T extends IForgeRegistryEntry<T>> extends RegistryEvent<T>
```

## Constructors

- `Register(ResourceLocation location, IForgeRegistry<T> registry)`

## Methods

- `ResourceLocation getLocation()`
- `IForgeRegistry<T> getRegistry()`
