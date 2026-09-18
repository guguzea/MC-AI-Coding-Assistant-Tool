---
title: "IChatComponent"
description: "Appends the given component to the end of this one."
package: "net/minecraft/util"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/util/IChatComponent.html"
sourceType: javadoc
---

# IChatComponent

## Class signature

```java
public interface IChatComponent extends java.lang.Iterable< IChatComponent >
```

## Methods

- `IChatComponent setChatStyle( ChatStyle style)`
- `ChatStyle getChatStyle()`
- `IChatComponent appendText(java.lang.String text)`
- `IChatComponent appendSibling( IChatComponent component)`
- `java.lang.String getUnformattedTextForChat()`
- `java.lang.String getUnformattedText()`
- `java.lang.String getFormattedText()`
- `java.util.List< IChatComponent > getSiblings()`
- `IChatComponent createCopy()`

## Description

Appends the given component to the end of this one.
