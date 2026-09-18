---
title: "DummyConfigElement"
description: "This class's main purpose is to provide the necessary objects for a sample Config GUI for FML, although there may be practical uses for the objects defined here such as using the DummyCategoryElement "
package: "net/minecraftforge/fml/client/config"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/client/config/DummyConfigElement.html"
sourceType: javadoc
---

# DummyConfigElement

## Class signature

```java
public class DummyConfigElement extends java.lang.Object implements IConfigElement
```

## Constructors

- `public DummyConfigElement(java.lang.String name, java.lang.Object defaultValue, ConfigGuiType type, java.lang.String langKey, java.lang.String[] validValues, java.util.regex.Pattern validStringPattern, java.lang.Object minValue, java.lang.Object maxValue)`
- `public DummyConfigElement(java.lang.String name, java.lang.Object defaultValue, ConfigGuiType type, java.lang.String langKey, java.util.regex.Pattern validStringPattern)`
- `public DummyConfigElement(java.lang.String name, java.lang.Object defaultValue, ConfigGuiType type, java.lang.String langKey, java.lang.String[] validValues)`
- `public DummyConfigElement(java.lang.String name, java.lang.Object defaultValue, ConfigGuiType type, java.lang.String langKey)`
- `public DummyConfigElement(java.lang.String name, java.lang.Object defaultValue, ConfigGuiType type, java.lang.String langKey, java.lang.Object minValue, java.lang.Object maxValue)`

## Methods

- `public DummyConfigElement setCustomListEntryClass(java.lang.Class<? extends GuiConfigEntries.IConfigEntry > clazz)`
- `public boolean isProperty()`
- `public IConfigElement setConfigEntryClass(java.lang.Class<? extends GuiConfigEntries.IConfigEntry > clazz)`
- `public java.lang.Class<? extends GuiConfigEntries.IConfigEntry > getConfigEntryClass()`
- `public IConfigElement setArrayEntryClass(java.lang.Class<? extends GuiEditArrayEntries.IArrayEntry > clazz)`
- `public java.lang.Class<? extends GuiEditArrayEntries.IArrayEntry > getArrayEntryClass()`
- `public java.lang.String getName()`
- `public java.lang.String getQualifiedName()`
- `public java.lang.String getLanguageKey()`
- `public java.lang.String getComment()`
- `public java.util.List< IConfigElement > getChildElements()`
- `public ConfigGuiType getType()`
- `public boolean isList()`
- `public boolean isListLengthFixed()`
- `public int getMaxListLength()`
- `public boolean isDefault()`
- `public java.lang.Object getDefault()`
- `public java.lang.Object[] getDefaults()`
- `public void setToDefault()`
- `public IConfigElement setRequiresWorldRestart(boolean requiresWorldRestart)`
- `public boolean requiresWorldRestart()`
- `public boolean showInGui()`
- `public IConfigElement setRequiresMcRestart(boolean requiresMcRestart)`
- `public boolean requiresMcRestart()`
- `public java.lang.String[] getValidValues()`
- `public java.util.regex.Pattern getValidationPattern()`
- `public java.lang.Object get()`
- `public java.lang.Object[] getList()`
- `public void set(java.lang.Object value)`
- `public void set(java.lang.Object[] aVal)`
- `public java.lang.Object getMinValue()`
- `public java.lang.Object getMaxValue()`

## Description

This class's main purpose is to provide the necessary objects for a sample Config GUI for FML, although there may be practical uses for the objects defined here such as using the DummyCategoryElement 
