---
title: "DummyConfigElement"
description: "public class DummyConfigElement<T> extends java.lang.Object implements IConfigElement<T>"
package: "cpw/mods/fml/client/config"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/client/config/DummyConfigElement.html"
sourceType: javadoc
---

# DummyConfigElement

**Inheritance:** java.lang.Object → cpw.mods.fml.client.config.DummyConfigElement<T>

## Class signature

```java
public class DummyConfigElement<T> extends java.lang.Object implements IConfigElement<T>
```

## Constructors

- `DummyConfigElement(java.lang.String name, T defaultValue, ConfigGuiType type, java.lang.String langKey)`
- `DummyConfigElement(java.lang.String name, T defaultValue, ConfigGuiType type, java.lang.String langKey, java.util.regex.Pattern validStringPattern)`
- `DummyConfigElement(java.lang.String name, T defaultValue, ConfigGuiType type, java.lang.String langKey, java.lang.String[] validValues)`
- `DummyConfigElement(java.lang.String name, T defaultValue, ConfigGuiType type, java.lang.String langKey, java.lang.String[] validValues, java.util.regex.Pattern validStringPattern, T minValue, T maxValue)`
- `DummyConfigElement(java.lang.String name, T defaultValue, ConfigGuiType type, java.lang.String langKey, T minValue, T maxValue)`

## Methods

- `java.lang.Object get()` — [Property] Gets this property value.
- `java.lang.Class<? extends GuiEditArrayEntries.IArrayEntry> getArrayEntryClass()` — This method returns a class that implements IArrayEntry .
- `java.util.List<IConfigElement> getChildElements()` — [Category] Gets this category's child categories/properties.
- `java.lang.String getComment()` — [Property, Category] Gets the comment for this object.
- `java.lang.Class<? extends GuiConfigEntries.IConfigEntry> getConfigEntryClass()` — This method returns a class that implements IConfigEntry or null.
- `java.lang.Object getDefault()` — [Property] Gets this property's default value.
- `T [] getDefaults()` — [Property] Gets this property's default values.
- `java.lang.String getLanguageKey()` — [Property, Category] Gets a language key for localization of config GUI entry names.
- `T [] getList()` — [Property] Gets this property value as a list.
- `int getMaxListLength()` — [Property] Gets the max length of this list property, or -1 if the length is unlimited.
- `T getMaxValue()` — [Property] Gets this property's maximum value.
- `T getMinValue()` — [Property] Gets this property's minimum value.
- `java.lang.String getName()` — [Property, Category] Gets the name of this object.
- `java.lang.String getQualifiedName()` — [Category] Gets the qualified name of this object.
- `ConfigGuiType getType()` — [Property, Category] Gets the ConfigGuiType value corresponding to the type of this property object, or CONFIG_CATEGORY if this is a category object.
- `java.util.regex.Pattern getValidationPattern()` — [Property] Gets a Pattern object used in String property input validation.
- `java.lang.String[] getValidValues()` — [Property] Gets a String array of valid values for this property.
- `boolean isDefault()` — [Property] Is this property value equal to the default value?
- `boolean isList()` — [Property] Is this property object a list?
- `boolean isListLengthFixed()` — [Property] Does this list property have to remain a fixed length?
- `boolean isProperty()` — Gets the value of the property property.
- `boolean requiresMcRestart()` — [Property, Category] Whether or not this element requires Minecraft to be restarted when changed.
- `boolean requiresWorldRestart()` — [Property, Category] Whether or not this element is safe to modify while a world is running.
- `void set(T value)` — [Property] Sets this property's value.
- `void set(T [] aVal)` — [Property] Sets this property's value to the specified array.
- `IConfigElement setArrayEntryClass(java.lang.Class<? extends GuiEditArrayEntries.IArrayEntry> clazz)`
- `IConfigElement setConfigEntryClass(java.lang.Class<? extends GuiConfigEntries.IConfigEntry> clazz)`
- `DummyConfigElement setCustomListEntryClass(java.lang.Class<? extends GuiConfigEntries.IConfigEntry> clazz)`
- `IConfigElement<T> setRequiresMcRestart(boolean requiresMcRestart)`
- `IConfigElement<T> setRequiresWorldRestart(boolean requiresWorldRestart)`
- `void setToDefault()` — [Property] Sets this property's value to the default value.
- `boolean showInGui()` — [Property, Category] Whether or not this element should be allowed to show on config GUIs.

## Fields

- `protected java.lang.Class<? extends GuiEditArrayEntries.IArrayEntry> arrayEntryClass`
- `protected java.util.List<IConfigElement> childElements`
- `protected java.lang.Class<? extends GuiConfigEntries.IConfigEntry> configEntryClass`
- `protected java.lang.Object defaultValue`
- `protected T [] defaultValues`
- `protected boolean isList`
- `protected boolean isListFixedLength`
- `protected boolean isProperty`
- `protected java.lang.String langKey`
- `protected int maxListLength`
- `protected T maxValue`
- `protected T minValue`
- `protected java.lang.String name`
- `protected boolean requiresMcRestart`
- `protected boolean requiresWorldRestart`
- `protected ConfigGuiType type`
- `protected java.util.regex.Pattern validStringPattern`
- `protected java.lang.String[] validValues`
- `protected java.lang.Object value`
- `protected T [] values`
