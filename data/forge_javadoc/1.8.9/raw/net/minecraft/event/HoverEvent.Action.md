---
title: "HoverEvent.Action"
description: "public static enum HoverEvent.Action extends java.lang.Enum<HoverEvent.Action>"
package: "net/minecraft/event"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/event/HoverEvent.Action.html"
sourceType: javadoc
---

# HoverEvent.Action

**Inheritance:** java.lang.Object → java.lang.Enum<HoverEvent.Action> → net.minecraft.event.HoverEvent.Action

## Class signature

```java
public static enum HoverEvent.Action extends java.lang.Enum<HoverEvent.Action>
```

## Methods

- `java.lang.String getCanonicalName()` — Gets the canonical name for this action (e.g., "show_achievement")
- `static HoverEvent.Action getValueByCanonicalName(java.lang.String canonicalNameIn)` — Gets a value by its canonical name.
- `boolean shouldAllowInChat()` — Indicates whether this event can be run from chat text.
- `static HoverEvent.Action valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static HoverEvent.Action [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.
