---
title: "FMLModIdMappingEvent"
description: "Called whenever the ID mapping might have changed. If you register for this event, you will be called back whenever the client or server loads an ID set. This includes both when the ID maps are loaded"
package: "net/minecraftforge/fml/common/event"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/event/FMLModIdMappingEvent.html"
sourceType: javadoc
---

# FMLModIdMappingEvent

## Class signature

```java
public class FMLModIdMappingEvent extends FMLEvent
```

## Constructors

- `public FMLModIdMappingEvent(java.util.Map< ResourceLocation ,java.util.Map< ResourceLocation ,java.lang.Integer[]>> remaps, boolean isFrozen)`

## Methods

- `public <any> getRegistries()`
- `public <any> getRemaps( ResourceLocation registry)`

## Description

Called whenever the ID mapping might have changed. If you register for this event, you will be called back whenever the client or server loads an ID set. This includes both when the ID maps are loaded
