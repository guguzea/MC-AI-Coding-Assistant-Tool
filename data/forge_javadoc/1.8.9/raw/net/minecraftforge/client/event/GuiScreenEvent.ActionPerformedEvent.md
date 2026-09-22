---
title: "GuiScreenEvent.ActionPerformedEvent"
description: "public static class GuiScreenEvent.ActionPerformedEvent extends GuiScreenEvent"
package: "net/minecraftforge/client/event"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/event/GuiScreenEvent.ActionPerformedEvent.html"
sourceType: javadoc
---

# GuiScreenEvent.ActionPerformedEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.client.event.GuiScreenEvent → net.minecraftforge.client.event.GuiScreenEvent.ActionPerformedEvent

## Class signature

```java
public static class GuiScreenEvent.ActionPerformedEvent extends GuiScreenEvent
```

## Constructors

- `ActionPerformedEvent(GuiScreen gui, GuiButton button, java.util.List<GuiButton> buttonList)`

## Fields

- `GuiButton button` — The button that was clicked.
- `java.util.List<GuiButton> buttonList` — A COPY of the buttonList field from the GuiScreen referenced by gui .
