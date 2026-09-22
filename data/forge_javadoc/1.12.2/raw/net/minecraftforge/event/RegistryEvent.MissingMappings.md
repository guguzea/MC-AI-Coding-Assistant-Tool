---
title: "RegistryEvent.MissingMappings"
description: "public static class RegistryEvent.MissingMappings<T extends IForgeRegistryEntry<T>> extends RegistryEvent<T>"
package: "net/minecraftforge/event"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/RegistryEvent.MissingMappings.html"
sourceType: javadoc
---

# RegistryEvent.MissingMappings

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.fml.common.eventhandler.GenericEvent<T> → net.minecraftforge.event.RegistryEvent<T> → net.minecraftforge.event.RegistryEvent.MissingMappings<T>

## Class signature

```java
public static class RegistryEvent.MissingMappings<T extends IForgeRegistryEntry<T>> extends RegistryEvent<T>
```

## Constructors

- `MissingMappings(ResourceLocation name, IForgeRegistry<T> registry, java.util.Collection<RegistryEvent.MissingMappings.Mapping<T>> missed)`

## Methods

- `<any> getAllMappings()`
- `<any> getMappings()`
- `ResourceLocation getName()`
- `IForgeRegistry<T> getRegistry()`
- `void setModContainer(ModContainer mod)`
