---
title: "TextComponentBase"
description: "public abstract class TextComponentBase extends java.lang.Object implements ITextComponent"
package: "net/minecraft/util/text"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/util/text/TextComponentBase.html"
sourceType: javadoc
---

# TextComponentBase

**Inheritance:** java.lang.Object → net.minecraft.util.text.TextComponentBase

## Class signature

```java
public abstract class TextComponentBase extends java.lang.Object implements ITextComponent
```

## Constructors

- `TextComponentBase()`

## Methods

- `ITextComponent appendSibling(ITextComponent component)`
- `ITextComponent appendText(java.lang.String text)`
- `static java.util.Iterator<ITextComponent> createDeepCopyIterator(java.lang.Iterable<ITextComponent> components)`
- `boolean equals(java.lang.Object p_equals_1_)`
- `java.lang.String getFormattedText()`
- `java.util.List<ITextComponent> getSiblings()`
- `Style getStyle()`
- `java.lang.String getUnformattedText()`
- `int hashCode()`
- `java.util.Iterator<ITextComponent> iterator()`
- `ITextComponent setStyle(Style style)`
- `java.lang.String toString()`

## Fields

- `protected java.util.List<ITextComponent> siblings`
