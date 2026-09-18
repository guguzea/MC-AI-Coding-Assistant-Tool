---
title: "ChatComponentStyle"
description: "Appends the given component to the end of this one."
package: "net/minecraft/util"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/util/ChatComponentStyle.html"
sourceType: javadoc
---

# ChatComponentStyle

## Class signature

```java
public abstract class ChatComponentStyle extends java.lang.Object implements IChatComponent
```

## Constructors

- `public ChatComponentStyle()`

## Methods

- `public IChatComponent appendSibling( IChatComponent component)`
- `public java.util.List< IChatComponent > getSiblings()`
- `public IChatComponent appendText(java.lang.String text)`
- `public IChatComponent setChatStyle( ChatStyle style)`
- `public ChatStyle getChatStyle()`
- `public java.util.Iterator< IChatComponent > iterator()`
- `public final java.lang.String getUnformattedText()`
- `public final java.lang.String getFormattedText()`
- `public static java.util.Iterator< IChatComponent > createDeepCopyIterator(java.lang.Iterable< IChatComponent > components)`
- `public boolean equals(java.lang.Object p_equals_1_)`
- `public int hashCode()`
- `public java.lang.String toString()`

## Description

Appends the given component to the end of this one.
