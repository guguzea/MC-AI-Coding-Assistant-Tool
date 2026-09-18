---
title: "ScreenshotEvent.html#resultMessage"
description: "This event is fired before and after a screenshot is taken This event is fired on the MinecraftForge.EVENT_BUS This event is Cancelable screenshotFile contains the file the screenshot will be/was save"
package: "net/minecraftforge/client/event"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/client/event/ScreenshotEvent.html#resultMessage"
sourceType: javadoc
---

# ScreenshotEvent.html#resultMessage

## Class signature

```java
public class ScreenshotEvent extends Event
```

## Methods

- `public ScreenshotEvent(java.awt.image.BufferedImage image, java.io.File screenshotFile)`
- `public java.awt.image.BufferedImage getImage()`
- `public java.io.File getScreenshotFile()`
- `public void setScreenshotFile(java.io.File screenshotFile)`
- `public ITextComponent getResultMessage()`
- `public void setResultMessage( ITextComponent resultMessage)`
- `public ITextComponent getCancelMessage()`

## Description

This event is fired before and after a screenshot is taken This event is fired on the MinecraftForge.EVENT_BUS This event is Cancelable screenshotFile contains the file the screenshot will be/was save
