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