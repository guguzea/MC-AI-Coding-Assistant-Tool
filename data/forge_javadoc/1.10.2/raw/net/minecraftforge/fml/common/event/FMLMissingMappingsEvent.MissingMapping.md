---
title: "FMLMissingMappingsEvent.MissingMapping"
description: "public static class FMLMissingMappingsEvent.MissingMapping extends java.lang.Object"
package: "net/minecraftforge/fml/common/event"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/event/FMLMissingMappingsEvent.MissingMapping.html"
sourceType: javadoc
---

# FMLMissingMappingsEvent.MissingMapping

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.event.FMLMissingMappingsEvent.MissingMapping

## Class signature

```java
public static class FMLMissingMappingsEvent.MissingMapping extends java.lang.Object
```

## Constructors

- `MissingMapping(GameRegistry.Type type, ResourceLocation name, int id)`

## Methods

- `void fail()` — Prevent the world from loading due to the missing item.
- `FMLMissingMappingsEvent.Action getAction()`
- `java.lang.Object getTarget()`
- `void ignore()` — Ignore the missing item.
- `void remap(Block target)` — Remap the missing item to the specified Block.
- `void remap(Item target)` — Remap the missing item to the specified Item.
- `void skipItemBlock()`
- `void warn()` — Warn the user about the missing item.

## Fields

- `int id`
- `java.lang.String name`
- `ResourceLocation resourceLocation`
- `GameRegistry.Type type`
