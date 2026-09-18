---
title: "FMLModIdMappingEvent"
description: "Called whenever the ID mapping might have changed. If you register for this event, you will be called back whenever the client or server loads an ID set. This includes both when the ID maps are loaded"
package: "net/minecraftforge/fml/common/event"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/event/FMLModIdMappingEvent.html"
sourceType: javadoc
---

# FMLModIdMappingEvent

## Class signature

```java
public class FMLModIdMappingEvent extends FMLEvent
```

## Constructors

- `public FMLModIdMappingEvent(java.util.Map< ResourceLocation ,java.lang.Integer[]> blocks, java.util.Map< ResourceLocation ,java.lang.Integer[]> items, boolean isFrozen)`

## Description

Called whenever the ID mapping might have changed. If you register for this event, you will be called back whenever the client or server loads an ID set. This includes both when the ID maps are loaded
