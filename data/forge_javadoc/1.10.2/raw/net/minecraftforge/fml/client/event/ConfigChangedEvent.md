---
title: "ConfigChangedEvent"
description: "These events are posted from the GuiConfig screen when the done button is pressed. The events are only posted if the parent screen is not an instance of GuiConfig or if the configID field has been set"
package: "net/minecraftforge/fml/client/event"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/client/event/ConfigChangedEvent.html"
sourceType: javadoc
---

# ConfigChangedEvent

## Class signature

```java
public class ConfigChangedEvent extends Event
```

## Constructors

- `public ConfigChangedEvent(java.lang.String modID, java.lang.String configID, boolean isWorldRunning, boolean requiresMcRestart)`

## Methods

- `public java.lang.String getModID()`
- `public boolean isWorldRunning()`
- `public boolean isRequiresMcRestart()`
- `public java.lang.String getConfigID()`

## Description

These events are posted from the GuiConfig screen when the done button is pressed. The events are only posted if the parent screen is not an instance of GuiConfig or if the configID field has been set
