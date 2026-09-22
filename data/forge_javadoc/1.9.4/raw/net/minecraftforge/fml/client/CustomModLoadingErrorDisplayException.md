---
title: "CustomModLoadingErrorDisplayException"
description: "public abstract class CustomModLoadingErrorDisplayException extends EnhancedRuntimeException implements IFMLHandledException"
package: "net/minecraftforge/fml/client"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/client/CustomModLoadingErrorDisplayException.html"
sourceType: javadoc
---

# CustomModLoadingErrorDisplayException

**Inheritance:** java.lang.Object → java.lang.Throwable → java.lang.Exception → java.lang.RuntimeException → net.minecraftforge.fml.common.EnhancedRuntimeException → net.minecraftforge.fml.client.CustomModLoadingErrorDisplayException

## Class signature

```java
public abstract class CustomModLoadingErrorDisplayException extends EnhancedRuntimeException implements IFMLHandledException
```

## Constructors

- `CustomModLoadingErrorDisplayException()`
- `CustomModLoadingErrorDisplayException(java.lang.String message, java.lang.Throwable cause)`

## Methods

- `abstract void drawScreen(GuiErrorScreen errorScreen, FontRenderer fontRenderer, int mouseRelX, int mouseRelY, float tickTime)` — Draw your error to the screen.
- `abstract void initGui(GuiErrorScreen errorScreen, FontRenderer fontRenderer)` — Called after the GUI is initialized by the parent code.
- `void printStackTrace(EnhancedRuntimeException.WrappedPrintStream s)`
