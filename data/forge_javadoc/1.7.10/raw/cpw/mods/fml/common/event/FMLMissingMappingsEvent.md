---
title: "FMLMissingMappingsEvent"
description: "This event is fired if a world is loaded that has block and item mappings referring the mod that are not in existence. These can be remapped to other existing objects, or simply discarded. Use get() a"
package: "cpw/mods/fml/common/event"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/event/FMLMissingMappingsEvent.html"
sourceType: javadoc
---

# FMLMissingMappingsEvent

## Class signature

```java
public class FMLMissingMappingsEvent extends FMLEvent
```

## Constructors

- `public FMLMissingMappingsEvent(<any> missingMappings)`

## Methods

- `public void applyModContainer( ModContainer activeContainer)`
- `public java.util.List< FMLMissingMappingsEvent.MissingMapping > get()`
- `public java.util.List< FMLMissingMappingsEvent.MissingMapping > getAll()`

## Description

This event is fired if a world is loaded that has block and item mappings referring the mod that are not in existence. These can be remapped to other existing objects, or simply discarded. Use get() a
