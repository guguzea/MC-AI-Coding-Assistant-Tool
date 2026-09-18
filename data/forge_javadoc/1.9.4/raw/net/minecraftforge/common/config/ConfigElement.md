---
title: "ConfigElement"
description: "This class bridges the gap between the FML config GUI classes and the Forge Configuration classes."
package: "net/minecraftforge/common/config"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/common/config/ConfigElement.html"
sourceType: javadoc
---

# ConfigElement

## Class signature

```java
public class ConfigElement extends java.lang.Object implements IConfigElement
```

## Constructors

- `public ConfigElement( ConfigCategory category)`
- `public ConfigElement( Property prop)`

## Methods

- `public ConfigElement listCategoriesFirst(boolean categoriesFirst)`
- `public java.util.List< IConfigElement > getChildElements()`
- `public java.lang.String getName()`
- `public boolean isProperty()`
- `public java.lang.Class<? extends GuiConfigEntries.IConfigEntry > getConfigEntryClass()`
- `public java.lang.Class<? extends GuiEditArrayEntries.IArrayEntry > getArrayEntryClass()`
- `public java.lang.String getQualifiedName()`
- `public ConfigGuiType getType()`
- `public static ConfigGuiType getType( Property prop)`
- `public boolean isList()`
- `public boolean isListLengthFixed()`
- `public int getMaxListLength()`
- `public java.lang.String getComment()`
- `public boolean isDefault()`
- `public void setToDefault()`
- `public boolean requiresWorldRestart()`
- `public boolean showInGui()`
- `public boolean requiresMcRestart()`
- `public java.lang.String[] getValidValues()`
- `public java.lang.String getLanguageKey()`
- `public java.lang.Object getDefault()`
- `public java.lang.Object[] getDefaults()`
- `public java.util.regex.Pattern getValidationPattern()`
- `public java.lang.Object get()`
- `public java.lang.Object[] getList()`
- `public void set(java.lang.Object value)`
- `public void set(java.lang.Object[] aVal)`
- `public java.lang.Object getMinValue()`
- `public java.lang.Object getMaxValue()`

## Description

This class bridges the gap between the FML config GUI classes and the Forge Configuration classes.
