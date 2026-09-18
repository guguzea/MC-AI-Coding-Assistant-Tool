# ScreenshotEvent.html#image

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