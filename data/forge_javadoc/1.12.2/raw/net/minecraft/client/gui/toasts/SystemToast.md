---
title: "SystemToast"
description: "public class SystemToast extends java.lang.Object implements IToast"
package: "net/minecraft/client/gui/toasts"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/gui/toasts/SystemToast.html"
sourceType: javadoc
---

# SystemToast

## Class signature

```java
public class SystemToast extends java.lang.Object implements IToast
```

## Constructors

- `public SystemToast( SystemToast.Type typeIn, ITextComponent titleComponent, ITextComponent subtitleComponent)`

## Methods

- `public IToast.Visibility draw( GuiToast toastGui, long delta)`
- `public void setDisplayedText( ITextComponent titleComponent, ITextComponent subtitleComponent)`
- `public SystemToast.Type getType()`
- `public static void addOrUpdate( GuiToast p_193657_0_, SystemToast.Type p_193657_1_, ITextComponent p_193657_2_, ITextComponent p_193657_3_)`
