---
title: "FMLMissingMappingsEvent"
description: "public class FMLMissingMappingsEvent extends FMLEvent"
package: "net/minecraftforge/fml/common/event"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/event/FMLMissingMappingsEvent.html"
sourceType: javadoc
---

# FMLMissingMappingsEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.event.FMLEvent → net.minecraftforge.fml.common.event.FMLMissingMappingsEvent

## Class signature

```java
public class FMLMissingMappingsEvent extends FMLEvent
```

## Constructors

- `FMLMissingMappingsEvent(com.google.common.collect.ListMultimap<java.lang.String, FMLMissingMappingsEvent.MissingMapping> missingMappings)`

## Methods

- `void applyModContainer(ModContainer activeContainer)`
- `java.util.List<FMLMissingMappingsEvent.MissingMapping> get()` — Get the list of missing mappings for the active mod.
- `java.util.List<FMLMissingMappingsEvent.MissingMapping> getAll()` — Get the list of missing mappings for all mods.
