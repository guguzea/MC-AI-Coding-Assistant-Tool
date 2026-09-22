---
title: "ConfigChangedEvent"
description: "public class ConfigChangedEvent extends Event"
package: "net/minecraftforge/fml/client/event"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/client/event/ConfigChangedEvent.html"
sourceType: javadoc
---

# ConfigChangedEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.fml.client.event.ConfigChangedEvent

## Class signature

```java
public class ConfigChangedEvent extends Event
```

## Constructors

- `ConfigChangedEvent(java.lang.String modID, java.lang.String configID, boolean isWorldRunning, boolean requiresMcRestart)`

## Methods

- `java.lang.String getConfigID()` — A String identifier for this ConfigChangedEvent.
- `java.lang.String getModID()` — The Mod ID of the mod whose configuration just changed.
- `boolean isRequiresMcRestart()` — Will be set to true if any elements were changed that require a restart of Minecraft.
- `boolean isWorldRunning()` — Whether or not a world is currently running.
