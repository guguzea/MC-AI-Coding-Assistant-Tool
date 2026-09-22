---
title: "GuiScreenEvent.ActionPerformedEvent"
description: "public static class GuiScreenEvent.ActionPerformedEvent extends GuiScreenEvent"
package: "net/minecraftforge/client/event"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/client/event/GuiScreenEvent.ActionPerformedEvent.html"
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

## Methods

- `GuiButton getButton()` — The button that was clicked.
- `java.util.List<GuiButton> getButtonList()` — A COPY of the buttonList field from the GuiScreen referenced by GuiScreenEvent.gui .
- `void setButton(GuiButton button)`
- `void setButtonList(java.util.List<GuiButton> buttonList)`
