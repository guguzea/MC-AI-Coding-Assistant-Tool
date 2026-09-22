---
title: "ChatStyle"
description: "public class ChatStyle extends java.lang.Object"
package: "net/minecraft/util"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/util/ChatStyle.html"
sourceType: javadoc
---

# ChatStyle

**Inheritance:** java.lang.Object → net.minecraft.util.ChatStyle

## Class signature

```java
public class ChatStyle extends java.lang.Object
```

## Constructors

- `ChatStyle()`

## Methods

- `ChatStyle createDeepCopy()` — Creates a deep copy of this style.
- `ChatStyle createShallowCopy()` — Creates a shallow copy of this style.
- `boolean equals(java.lang.Object p_equals_1_)`
- `boolean getBold()` — Whether or not text of this ChatStyle should be in bold.
- `ClickEvent getChatClickEvent()` — The effective chat click event.
- `HoverEvent getChatHoverEvent()` — The effective chat hover event.
- `EnumChatFormatting getColor()` — Gets the effective color of this ChatStyle.
- `java.lang.String getFormattingCode()` — Gets the equivalent text formatting code for this style, without the initial section sign (U+00A7) character.
- `java.lang.String getInsertion()` — Get the text to be inserted into Chat when the component is shift-clicked
- `boolean getItalic()` — Whether or not text of this ChatStyle should be italicized.
- `boolean getObfuscated()` — Whether or not text of this ChatStyle should be obfuscated.
- `boolean getStrikethrough()` — Whether or not to format text of this ChatStyle using strikethrough.
- `boolean getUnderlined()` — Whether or not text of this ChatStyle should be underlined.
- `int hashCode()`
- `boolean isEmpty()` — Whether or not this style is empty (inherits everything from the parent).
- `ChatStyle setBold(java.lang.Boolean boldIn)` — Sets whether or not text of this ChatStyle should be in bold.
- `ChatStyle setChatClickEvent(ClickEvent event)` — Sets the event that should be run when text of this ChatStyle is clicked on.
- `ChatStyle setChatHoverEvent(HoverEvent event)` — Sets the event that should be run when text of this ChatStyle is hovered over.
- `ChatStyle setColor(EnumChatFormatting color)` — Sets the color for this ChatStyle to the given value.
- `ChatStyle setInsertion(java.lang.String insertion)` — Set a text to be inserted into Chat when the component is shift-clicked
- `ChatStyle setItalic(java.lang.Boolean italic)` — Sets whether or not text of this ChatStyle should be italicized.
- `ChatStyle setObfuscated(java.lang.Boolean obfuscated)` — Sets whether or not text of this ChatStyle should be obfuscated.
- `ChatStyle setParentStyle(ChatStyle parent)` — Sets the fallback ChatStyle to use if this ChatStyle does not override some value.
- `ChatStyle setStrikethrough(java.lang.Boolean strikethrough)` — Sets whether or not to format text of this ChatStyle using strikethrough.
- `ChatStyle setUnderlined(java.lang.Boolean underlined)` — Sets whether or not text of this ChatStyle should be underlined.
- `java.lang.String toString()`
