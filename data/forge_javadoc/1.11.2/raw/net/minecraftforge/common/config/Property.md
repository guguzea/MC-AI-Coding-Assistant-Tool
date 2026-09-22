---
title: "Property"
description: "public class Property extends java.lang.Object"
package: "net/minecraftforge/common/config"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/common/config/Property.html"
sourceType: javadoc
---

# Property

**Inheritance:** java.lang.Object → net.minecraftforge.common.config.Property

## Class signature

```java
public class Property extends java.lang.Object
```

## Constructors

- `Property(java.lang.String name, java.lang.String[] values, Property.Type type)`
- `Property(java.lang.String name, java.lang.String[] values, Property.Type type, java.lang.String langKey)`
- `Property(java.lang.String name, java.lang.String value, Property.Type type)`
- `Property(java.lang.String name, java.lang.String value, Property.Type type, boolean read)`
- `Property(java.lang.String name, java.lang.String value, Property.Type type, boolean read, java.lang.String langKey)`
- `Property(java.lang.String name, java.lang.String value, Property.Type type, java.lang.String langKey)`
- `Property(java.lang.String name, java.lang.String value, Property.Type type, java.lang.String[] validValues)`
- `Property(java.lang.String name, java.lang.String value, Property.Type type, java.lang.String[] validValues, java.lang.String langKey)`

## Methods

- `java.lang.Class<? extends GuiEditArrayEntries.IArrayEntry> getArrayEntryClass()` — Gets the custom IArrayEntry class that should be used in place of the standard entry class for this Property type, or null if none has been set.
- `boolean getBoolean()` — Returns the value in this property as a boolean, if the value is not a valid boolean, it will return the provided default.
- `boolean getBoolean(boolean _default)` — Returns the value in this property as a boolean, if the value is not a valid boolean, it will return the provided default.
- `boolean[] getBooleanList()` — Returns the boolean value of all values that can be parsed in the list.
- `java.lang.String getComment()`
- `java.lang.Class<? extends GuiConfigEntries.IConfigEntry> getConfigEntryClass()` — Gets the custom IConfigEntry class that should be used in place of the standard entry class for this Property type, or null if none has been set.
- `java.lang.String getDefault()` — Gets the raw String default value of this Property.
- `java.lang.String[] getDefaults()` — Gets the raw String[] default values of this Property.
- `double getDouble()` — Returns the value in this property as a double, if the value is not a valid double, it will return the provided default.
- `double getDouble(double _default)` — Returns the value in this property as a double, if the value is not a valid double, it will return the provided default.
- `double[] getDoubleList()` — Returns the double value of all values that can be parsed in the list.
- `int getInt()` — Returns the value in this property as an integer, if the value is not a valid integer, it will return the initially provided default.
- `int getInt(int _default)` — Returns the value in this property as an integer, if the value is not a valid integer, it will return the provided default.
- `int[] getIntList()` — Returns the integer value of all values that can be parsed in the list.
- `java.lang.String getLanguageKey()` — Gets the language key string for this Property.
- `long getLong()` — Returns the value in this property as a long, if the value is not a valid long, it will return the initially provided default.
- `long getLong(long _default)` — Returns the value in this property as a long, if the value is not a valid long, it will return the provided default.
- `int getMaxListLength()` — Gets the maximum length of this list/array Property.
- `java.lang.String getMaxValue()` — Gets the maximum value.
- `java.lang.String getMinValue()` — Gets the minimum value.
- `java.lang.String getName()` — Gets the name/key for this Property.
- `java.lang.String getString()` — Returns the value in this property as it's raw string.
- `java.lang.String[] getStringList()`
- `Property.Type getType()` — Gets the Property.Type enum value for this Property.
- `java.util.regex.Pattern getValidationPattern()` — Gets the Pattern object used to validate user input for this Property.
- `java.lang.String[] getValidValues()` — Gets the array of valid values that this String Property can be set to, or null if not defined.
- `boolean hasChanged()` — Gets the changed status of this Property.
- `boolean isBooleanList()` — Checks if all of current values stored in this property can be converted to a boolean.
- `boolean isBooleanValue()` — Checks if the current value held by this property is a valid boolean value.
- `boolean isDefault()` — Returns whether or not this Property is defaulted.
- `boolean isDoubleList()` — Checks if all of the current values stored in this property can be converted to a double.
- `boolean isDoubleValue()` — Checks if the current value held by this property is a valid double value.
- `boolean isIntList()` — Checks if all of the current values stored in this property can be converted to an integer.
- `boolean isIntValue()` — Checks if the current value stored in this property can be converted to an integer.
- `boolean isList()` — Returns whether or not this Property is a list/array.
- `boolean isListLengthFixed()` — Returns whether or not this list/array has a fixed length.
- `boolean isLongValue()` — Checks if the current value stored in this property can be converted to a long.
- `boolean requiresMcRestart()` — Gets whether or not this Property requires Minecraft to be restarted when changed.
- `boolean requiresWorldRestart()` — Returns whether or not this Property is able to be edited while a world is running using the in-game Mod Options screen as well as the Mods list screen, or only from the Mods list screen.
- `void set(boolean value)`
- `void set(boolean[] values)`
- `void set(double value)`
- `void set(double[] values)`
- `void set(int value)`
- `void set(int[] values)`
- `void set(long value)`
- `void set(java.lang.String value)`
- `void set(java.lang.String[] values)`
- `Property setArrayEntryClass(java.lang.Class<? extends GuiEditArrayEntries.IArrayEntry> clazz)` — Sets a custom IGuiEditListEntry class that should be used in place of the standard entry class for this Property type.
- `void setComment(java.lang.String comment)`
- `Property setConfigEntryClass(java.lang.Class<? extends GuiConfigEntries.IConfigEntry> clazz)` — Sets a custom IConfigEntry class that should be used in place of the standard entry class for this Property type.
- `Property setDefaultValue(boolean defaultValue)` — Sets the default boolean value of this Property.
- `Property setDefaultValue(double defaultValue)` — Sets the default double value of this Property.
- `Property setDefaultValue(int defaultValue)` — Sets the default int value of this Property.
- `Property setDefaultValue(java.lang.String defaultValue)` — Sets the default string value of this Property.
- `Property setDefaultValues(boolean[] defaultValues)` — Sets the default boolean[] values of this Property.
- `Property setDefaultValues(double[] defaultValues)` — Sets the default double[] values of this Property
- `Property setDefaultValues(int[] defaultValues)` — Sets the default int[] values of this Property.
- `Property setDefaultValues(java.lang.String[] defaultValues)` — Sets the default String[] values of this Property.
- `Property setIsListLengthFixed(boolean isListLengthFixed)` — Sets the flag for whether this list/array Property has a fixed length.
- `Property setLanguageKey(java.lang.String langKey)` — Sets the localization language key for this Property so that the config GUI screens are nice and pretty <3.
- `Property setMaxListLength(int max)` — Sets the maximum length of this list/array Property.
- `Property setMaxValue(double maxValue)` — Sets the maximum double value of this Property.
- `Property setMaxValue(int maxValue)` — Sets the maximum int value of this Property.
- `Property setMinValue(double minValue)` — Sets the minimum double value of this Property.
- `Property setMinValue(int minValue)` — Sets the minimum int value of this Property.
- `void setName(java.lang.String name)` — Sets the name/key for this Property.
- `Property setRequiresMcRestart(boolean requiresMcRestart)` — Sets whether or not this Property requires Minecraft to be restarted when changed.
- `Property setRequiresWorldRestart(boolean requiresWorldRestart)` — Sets the flag for whether or not this Property can be edited while a world is running.
- `Property setShowInGui(boolean showInGui)` — Sets whether or not this Property should be allowed to show on config GUIs.
- `Property setToDefault()` — Sets the current value(s) of this Property to the default value(s).
- `Property setValidationPattern(java.util.regex.Pattern validationPattern)` — Sets a regex Pattern object used to validate user input for formatted String or String[] properties.
- `Property setValidValues(java.lang.String[] validValues)` — Sets the array of valid values that this String Property can be set to.
- `Property setValue(boolean value)` — Sets the value of this Property to the provided boolean value.
- `Property setValue(double value)` — Sets the value of this Property to the provided double value.
- `Property setValue(int value)` — Sets the value of this Property to the provided int value.
- `Property setValue(java.lang.String value)` — Sets the value of this Property to the provided String value.
- `Property setValues(boolean[] values)` — Sets the values of this Property to the provided boolean[] values.
- `Property setValues(double[] values)` — Sets the values of this Property to the provided double[] values.
- `Property setValues(int[] values)` — Sets the values of this Property to the provided int[] values.
- `Property setValues(java.lang.String[] values)` — Sets the values of this Property to the provided String[] values.
- `boolean showInGui()` — Gets whether or not this Property should be allowed to show on config GUIs.
- `boolean wasRead()` — Determines if this config value was just created, or if it was read from the config file.
