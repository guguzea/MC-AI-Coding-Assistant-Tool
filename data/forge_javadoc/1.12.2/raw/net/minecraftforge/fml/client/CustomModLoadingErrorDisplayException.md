---
title: "CustomModLoadingErrorDisplayException"
description: "If a mod throws this exception during loading, it will be called back to render the error screen through the methods below. This error will not be cleared, and will not allow the game to carry on, but"
package: "net/minecraftforge/fml/client"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/client/CustomModLoadingErrorDisplayException.html"
sourceType: javadoc
---

# CustomModLoadingErrorDisplayException

## Class signature

```java
public abstract class CustomModLoadingErrorDisplayException extends EnhancedRuntimeException implements IFMLHandledException , IDisplayableError
```

## Constructors

- `public CustomModLoadingErrorDisplayException()`
- `public CustomModLoadingErrorDisplayException(java.lang.String message, java.lang.Throwable cause)`

## Methods

- `public abstract void initGui( GuiErrorScreen errorScreen, FontRenderer fontRenderer)`
- `public abstract void drawScreen( GuiErrorScreen errorScreen, FontRenderer fontRenderer, int mouseRelX, int mouseRelY, float tickTime)`
- `public void printStackTrace( EnhancedRuntimeException.WrappedPrintStream s)`
- `public final GuiScreen createGui()`

## Description

If a mod throws this exception during loading, it will be called back to render the error screen through the methods below. This error will not be cleared, and will not allow the game to carry on, but
