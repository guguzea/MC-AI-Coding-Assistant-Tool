---
title: "IChatComponent"
description: "public interface IChatComponent extends java.lang.Iterable<IChatComponent>"
package: "net/minecraft/util"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/util/IChatComponent.html"
sourceType: javadoc
---

# IChatComponent

## Class signature

```java
public interface IChatComponent extends java.lang.Iterable<IChatComponent>
```

## Methods

- `IChatComponent appendSibling(IChatComponent component)` — Appends the given component to the end of this one.
- `IChatComponent appendText(java.lang.String text)` — Appends the given text to the end of this component.
- `IChatComponent createCopy()` — Creates a copy of this component.
- `ChatStyle getChatStyle()`
- `java.lang.String getFormattedText()` — Gets the text of this component, with formatting codes added for rendering.
- `java.util.List<IChatComponent> getSiblings()`
- `java.lang.String getUnformattedText()` — Get the text of this component, and all child components , with all special formatting codes removed.
- `java.lang.String getUnformattedTextForChat()` — Gets the text of this component, without any special formatting codes added, for chat.
- `IChatComponent setChatStyle(ChatStyle style)`
