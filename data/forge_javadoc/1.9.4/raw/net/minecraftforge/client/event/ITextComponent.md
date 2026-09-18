---
title: "ITextComponent"
description: "public interface ITextComponent extends java.lang.Iterable< ITextComponent >"
package: "net/minecraftforge/client/event"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/util/text/ITextComponent.html"
sourceType: javadoc
---

# ITextComponent

## Class signature

```java
public interface ITextComponent extends java.lang.Iterable< ITextComponent >
```

## Methods

- `ITextComponent setStyle( Style style)`
- `Style getStyle()`
- `ITextComponent appendText(java.lang.String text)`
- `ITextComponent appendSibling( ITextComponent component)`
- `java.lang.String getUnformattedComponentText()`
- `java.lang.String getUnformattedText()`
- `java.lang.String getFormattedText()`
- `java.util.List< ITextComponent > getSiblings()`
- `ITextComponent createCopy()`
