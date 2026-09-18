---
title: "DummyConfigElement"
description: "This class's main purpose is to provide the necessary objects for a sample Config GUI for FML, although there may be practical uses for the objects defined here such as using the DummyCategoryElement "
package: "cpw/mods/fml/client/config"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/client/config/DummyConfigElement.html"
sourceType: javadoc
---

# DummyConfigElement

## Class signature

```java
public class DummyConfigElement<T> extends java.lang.Object implements IConfigElement <T>
```

## Constructors

- `public DummyConfigElement(java.lang.String name, T defaultValue, ConfigGuiType type, java.lang.String langKey, java.lang.String[] validValues, java.util.regex.Pattern validStringPattern, T minValue, T maxValue)`
- `public DummyConfigElement(java.lang.String name, T defaultValue, ConfigGuiType type, java.lang.String langKey, java.util.regex.Pattern validStringPattern)`
- `public DummyConfigElement(java.lang.String name, T defaultValue, ConfigGuiType type, java.lang.String langKey, java.lang.String[] validValues)`
- `public DummyConfigElement(java.lang.String name, T defaultValue, ConfigGuiType type, java.lang.String langKey)`
- `public DummyConfigElement(java.lang.String name, T defaultValue, ConfigGuiType type, java.lang.String langKey, T minValue, T maxValue)`

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
- `public T [] getDefaults()`
- `public void setToDefault()`
- `public IConfigElement < T > setRequiresWorldRestart(boolean requiresWorldRestart)`
- `public boolean requiresWorldRestart()`
- `public boolean showInGui()`
- `public IConfigElement < T > setRequiresMcRestart(boolean requiresMcRestart)`
- `public boolean requiresMcRestart()`
- `public java.lang.String[] getValidValues()`
- `public java.util.regex.Pattern getValidationPattern()`
- `public java.lang.Object get()`
- `public T [] getList()`
- `public void set( T value)`
- `public void set( T [] aVal)`
- `public T getMinValue()`
- `public T getMaxValue()`

## Description

This class's main purpose is to provide the necessary objects for a sample Config GUI for FML, although there may be practical uses for the objects defined here such as using the DummyCategoryElement 
