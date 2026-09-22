---
title: "EnumChatFormatting"
description: "public enum EnumChatFormatting extends java.lang.Enum<EnumChatFormatting>"
package: "net/minecraft/util"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/util/EnumChatFormatting.html"
sourceType: javadoc
---

# EnumChatFormatting

**Inheritance:** java.lang.Object → java.lang.Enum<EnumChatFormatting> → net.minecraft.util.EnumChatFormatting

## Class signature

```java
public enum EnumChatFormatting extends java.lang.Enum<EnumChatFormatting>
```

## Methods

- `static EnumChatFormatting func_175744_a(int p_175744_0_)`
- `int getColorIndex()` — Returns the numerical color index that represents this formatting
- `java.lang.String getFriendlyName()` — Gets the friendly name of this value.
- `static java.lang.String getTextWithoutFormattingCodes(java.lang.String text)` — Returns a copy of the given string, with formatting codes stripped away.
- `static java.util.Collection<java.lang.String> getValidValues(boolean p_96296_0_, boolean p_96296_1_)`
- `static EnumChatFormatting getValueByName(java.lang.String friendlyName)` — Gets a value by its friendly name; null if the given name does not map to a defined value.
- `boolean isColor()` — Checks if this is a color code.
- `boolean isFancyStyling()` — False if this is just changing the color or resetting; true otherwise.
- `java.lang.String toString()`
- `static EnumChatFormatting valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static EnumChatFormatting [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.
