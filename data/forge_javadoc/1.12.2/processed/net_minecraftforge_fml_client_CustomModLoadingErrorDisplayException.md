# CustomModLoadingErrorDisplayException

**Inheritance:** java.lang.Object → java.lang.Throwable → java.lang.Exception → java.lang.RuntimeException → net.minecraftforge.fml.common.EnhancedRuntimeException → net.minecraftforge.fml.client.CustomModLoadingErrorDisplayException

## Class signature

```java
public abstract class CustomModLoadingErrorDisplayException extends EnhancedRuntimeException implements IFMLHandledException, IDisplayableError
```

## Constructors

- `CustomModLoadingErrorDisplayException()`
- `CustomModLoadingErrorDisplayException(java.lang.String message, java.lang.Throwable cause)`

## Methods

- `GuiScreen createGui()`
- `abstract void drawScreen(GuiErrorScreen errorScreen, FontRenderer fontRenderer, int mouseRelX, int mouseRelY, float tickTime)` — Draw your error to the screen.
- `abstract void initGui(GuiErrorScreen errorScreen, FontRenderer fontRenderer)` — Called after the GUI is initialized by the parent code.
- `void printStackTrace(EnhancedRuntimeException.WrappedPrintStream s)`