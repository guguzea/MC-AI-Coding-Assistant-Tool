---
title: "GuiOpenEvent"
description: "This event is called before any Gui will open. If you don't want this to happen, cancel the event. If you want to override this Gui, simply set the gui variable to your own Gui."
package: "net/minecraftforge/client/event"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/client/event/GuiOpenEvent.html"
sourceType: javadoc
---

# GuiOpenEvent

## Class signature

```java
public class GuiOpenEvent extends Event
```

## Constructors

- `public GuiOpenEvent( GuiScreen gui)`

## Methods

- `public GuiScreen getGui()`
- `public void setGui( GuiScreen gui)`

## Description

This event is called before any Gui will open. If you don't want this to happen, cancel the event. If you want to override this Gui, simply set the gui variable to your own Gui.
