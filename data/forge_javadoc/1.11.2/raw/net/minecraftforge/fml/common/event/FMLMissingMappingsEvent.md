---
title: "FMLMissingMappingsEvent"
description: "This event is fired if a world is loaded that has block and item mappings referring the mod that are not in existence. These can be remapped to other existing objects, or simply discarded. Use get() a"
package: "net/minecraftforge/fml/common/event"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/common/event/FMLMissingMappingsEvent.html"
sourceType: javadoc
---

# FMLMissingMappingsEvent

## Class signature

```java
public class FMLMissingMappingsEvent extends FMLEvent
```

## Constructors

- `public FMLMissingMappingsEvent(com.google.common.collect.ListMultimap<java.lang.String, FMLMissingMappingsEvent.MissingMapping > missingMappings)`

## Methods

- `public void applyModContainer( ModContainer activeContainer)`
- `public java.util.List< FMLMissingMappingsEvent.MissingMapping > get()`
- `public java.util.List< FMLMissingMappingsEvent.MissingMapping > getAll()`

## Description

This event is fired if a world is loaded that has block and item mappings referring the mod that are not in existence. These can be remapped to other existing objects, or simply discarded. Use get() a
