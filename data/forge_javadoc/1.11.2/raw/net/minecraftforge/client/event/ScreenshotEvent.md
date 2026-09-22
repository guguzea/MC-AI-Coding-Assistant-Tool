---
title: "ScreenshotEvent"
description: "public class ScreenshotEvent extends Event"
package: "net/minecraftforge/client/event"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/client/event/ScreenshotEvent.html"
sourceType: javadoc
---

# ScreenshotEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.client.event.ScreenshotEvent

## Class signature

```java
public class ScreenshotEvent extends Event
```

## Constructors

- `ScreenshotEvent(java.awt.image.BufferedImage image, java.io.File screenshotFile)`

## Methods

- `ITextComponent getCancelMessage()`
- `java.awt.image.BufferedImage getImage()`
- `ITextComponent getResultMessage()`
- `java.io.File getScreenshotFile()`
- `void setResultMessage(ITextComponent resultMessage)`
- `void setScreenshotFile(java.io.File screenshotFile)`

## Fields

- `static ITextComponent DEFAULT_CANCEL_REASON`
