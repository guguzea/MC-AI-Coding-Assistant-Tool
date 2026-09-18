---
title: "IConfigElement"
description: "This interface provides the information needed by GuiConfig and GuiConfigEntries to display config elements for editing."
package: "net/minecraftforge/fml/client/config"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/client/config/IConfigElement.html"
sourceType: javadoc
---

# IConfigElement

## Class signature

```java
public interface IConfigElement
```

## Methods

- `boolean isProperty()`
- `java.lang.Class<? extends GuiConfigEntries.IConfigEntry > getConfigEntryClass()`
- `java.lang.Class<? extends GuiEditArrayEntries.IArrayEntry > getArrayEntryClass()`
- `java.lang.String getName()`
- `java.lang.String getQualifiedName()`
- `java.lang.String getLanguageKey()`
- `java.lang.String getComment()`
- `java.util.List< IConfigElement > getChildElements()`
- `ConfigGuiType getType()`
- `boolean isList()`
- `boolean isListLengthFixed()`
- `int getMaxListLength()`
- `boolean isDefault()`
- `java.lang.Object getDefault()`
- `java.lang.Object[] getDefaults()`
- `void setToDefault()`
- `boolean requiresWorldRestart()`
- `boolean showInGui()`
- `boolean requiresMcRestart()`
- `java.lang.Object get()`
- `java.lang.Object[] getList()`
- `void set(java.lang.Object value)`
- `void set(java.lang.Object[] aVal)`
- `java.lang.String[] getValidValues()`
- `java.lang.Object getMinValue()`
- `java.lang.Object getMaxValue()`
- `java.util.regex.Pattern getValidationPattern()`

## Description

This interface provides the information needed by GuiConfig and GuiConfigEntries to display config elements for editing.
