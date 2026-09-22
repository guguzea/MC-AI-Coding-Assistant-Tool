---
title: "FMLMissingMappingsEvent"
description: "public class FMLMissingMappingsEvent extends FMLEvent"
package: "cpw/mods/fml/common/event"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/event/FMLMissingMappingsEvent.html"
sourceType: javadoc
---

# FMLMissingMappingsEvent

**Inheritance:** java.lang.Object → cpw.mods.fml.common.event.FMLEvent → cpw.mods.fml.common.event.FMLMissingMappingsEvent

## Class signature

```java
public class FMLMissingMappingsEvent extends FMLEvent
```

## Constructors

- `FMLMissingMappingsEvent(<any> missingMappings)`

## Methods

- `void applyModContainer(ModContainer activeContainer)`
- `java.util.List<FMLMissingMappingsEvent.MissingMapping> get()` — Get the list of missing mappings for the active mod.
- `java.util.List<FMLMissingMappingsEvent.MissingMapping> getAll()` — Get the list of missing mappings for all mods.
