---
title: "ConfigChangedEvent.PostConfigChangedEvent"
description: "This event is provided for mods to consume if they want to be able to check if other mods' configs have been changed. This event only fires if the OnConfigChangedEvent result is not DENY."
package: "net/minecraftforge/fml/client/event"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/client/event/ConfigChangedEvent.PostConfigChangedEvent.html"
sourceType: javadoc
---

# ConfigChangedEvent.PostConfigChangedEvent

## Constructors

- `public PostConfigChangedEvent(java.lang.String modID, java.lang.String configID, boolean isWorldRunning, boolean requiresMcRestart)`

## Description

This event is provided for mods to consume if they want to be able to check if other mods' configs have been changed. This event only fires if the OnConfigChangedEvent result is not DENY.
