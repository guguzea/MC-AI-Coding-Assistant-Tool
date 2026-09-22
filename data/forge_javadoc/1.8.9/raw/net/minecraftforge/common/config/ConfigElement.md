---
title: "ConfigElement"
description: "public class ConfigElement extends java.lang.Object implements IConfigElement"
package: "net/minecraftforge/common/config"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/common/config/ConfigElement.html"
sourceType: javadoc
---

# ConfigElement

**Inheritance:** java.lang.Object → net.minecraftforge.common.config.ConfigElement

## Class signature

```java
public class ConfigElement extends java.lang.Object implements IConfigElement
```

## Constructors

- `ConfigElement(ConfigCategory ctgy)`
- `ConfigElement(Property prop)`

## Methods

- `java.lang.Object get()` — [Property] Gets this property value.
- `java.lang.Class<? extends GuiEditArrayEntries.IArrayEntry> getArrayEntryClass()` — This method returns a class that implements IArrayEntry .
- `java.util.List<IConfigElement> getChildElements()` — [Category] Gets this category's child categories/properties.
- `java.lang.String getComment()` — [Property, Category] Gets the comment for this object.
- `java.lang.Class<? extends GuiConfigEntries.IConfigEntry> getConfigEntryClass()` — This method returns a class that implements IConfigEntry or null.
- `java.lang.Object getDefault()` — [Property] Gets this property's default value.
- `java.lang.Object[] getDefaults()` — [Property] Gets this property's default values.
- `java.lang.String getLanguageKey()` — [Property, Category] Gets a language key for localization of config GUI entry names.
- `java.lang.Object[] getList()` — [Property] Gets this property value as a list.
- `int getMaxListLength()` — [Property] Gets the max length of this list property, or -1 if the length is unlimited.
- `java.lang.Object getMaxValue()` — [Property] Gets this property's maximum value.
- `java.lang.Object getMinValue()` — [Property] Gets this property's minimum value.
- `java.lang.String getName()` — [Property, Category] Gets the name of this object.
- `java.lang.String getQualifiedName()` — [Category] Gets the qualified name of this object.
- `ConfigGuiType getType()` — [Property, Category] Gets the ConfigGuiType value corresponding to the type of this property object, or CONFIG_CATEGORY if this is a category object.
- `static ConfigGuiType getType(Property prop)`
- `java.util.regex.Pattern getValidationPattern()` — [Property] Gets a Pattern object used in String property input validation.
- `java.lang.String[] getValidValues()` — [Property] Gets a String array of valid values for this property.
- `boolean isDefault()` — [Property] Is this property value equal to the default value?
- `boolean isList()` — [Property] Is this property object a list?
- `boolean isListLengthFixed()` — [Property] Does this list property have to remain a fixed length?
- `boolean isProperty()` — [Property, Category] Is this object a property object?
- `ConfigElement listCategoriesFirst(boolean categoriesFirst)`
- `boolean requiresMcRestart()` — [Property, Category] Whether or not this element requires Minecraft to be restarted when changed.
- `boolean requiresWorldRestart()` — [Property, Category] Whether or not this element is safe to modify while a world is running.
- `void set(java.lang.Object value)` — [Property] Sets this property's value.
- `void set(java.lang.Object[] aVal)` — [Property] Sets this property's value to the specified array.
- `void setToDefault()` — [Property] Sets this property's value to the default value.
- `boolean showInGui()` — [Property, Category] Whether or not this element should be allowed to show on config GUIs.
