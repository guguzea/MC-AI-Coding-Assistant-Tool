---
title: "Property"
description: "Gets the custom IArrayEntry class that should be used in place of the standard entry class for this Property type, or null if none has been set."
package: "net/minecraftforge/common/config"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/common/config/Property.html"
sourceType: javadoc
---

# Property

## Class signature

```java
public class Property extends java.lang.Object
```

## Constructors

- `public Property(java.lang.String name, java.lang.String value, Property.Type type)`
- `public Property(java.lang.String name, java.lang.String value, Property.Type type, boolean read)`
- `public Property(java.lang.String name, java.lang.String value, Property.Type type, java.lang.String[] validValues)`
- `public Property(java.lang.String name, java.lang.String value, Property.Type type, java.lang.String langKey)`
- `public Property(java.lang.String name, java.lang.String value, Property.Type type, boolean read, java.lang.String langKey)`
- `public Property(java.lang.String name, java.lang.String value, Property.Type type, java.lang.String[] validValues, java.lang.String langKey)`
- `public Property(java.lang.String name, java.lang.String[] values, Property.Type type)`
- `public Property(java.lang.String name, java.lang.String[] values, Property.Type type, java.lang.String langKey)`

## Methods

- `public java.lang.String getComment()`
- `public void setComment(java.lang.String comment)`
- `public boolean isDefault()`
- `public Property setToDefault()`
- `public java.lang.String getDefault()`
- `public java.lang.String[] getDefaults()`
- `public Property setRequiresWorldRestart(boolean requiresWorldRestart)`
- `public boolean requiresWorldRestart()`
- `public Property setShowInGui(boolean showInGui)`
- `public boolean showInGui()`
- `public Property setRequiresMcRestart(boolean requiresMcRestart)`
- `public boolean requiresMcRestart()`
- `public Property setMaxListLength(int max)`
- `public int getMaxListLength()`
- `public Property setIsListLengthFixed(boolean isListLengthFixed)`
- `public boolean isListLengthFixed()`
- `public Property setConfigEntryClass(java.lang.Class<? extends GuiConfigEntries.IConfigEntry > clazz)`
- `public java.lang.Class<? extends GuiConfigEntries.IConfigEntry > getConfigEntryClass()`
- `public Property setArrayEntryClass(java.lang.Class<? extends GuiEditArrayEntries.IArrayEntry > clazz)`
- `public java.lang.Class<? extends GuiEditArrayEntries.IArrayEntry > getArrayEntryClass()`
- `public Property setValidationPattern(java.util.regex.Pattern validationPattern)`
- `public java.util.regex.Pattern getValidationPattern()`
- `public Property setLanguageKey(java.lang.String langKey)`
- `public java.lang.String getLanguageKey()`
- `public Property setDefaultValue(java.lang.String defaultValue)`
- `public Property setDefaultValues(java.lang.String[] defaultValues)`
- `public Property setDefaultValue(int defaultValue)`
- `public Property setDefaultValues(int[] defaultValues)`
- `public Property setDefaultValue(double defaultValue)`
- `public Property setDefaultValues(double[] defaultValues)`
- `public Property setDefaultValue(boolean defaultValue)`
- `public Property setDefaultValues(boolean[] defaultValues)`
- `public Property setMinValue(int minValue)`
- `public Property setMaxValue(int maxValue)`
- `public Property setMinValue(double minValue)`
- `public Property setMaxValue(double maxValue)`
- `public java.lang.String getMinValue()`
- `public java.lang.String getMaxValue()`
- `public java.lang.String getString()`
- `public Property setValidValues(java.lang.String[] validValues)`
- `public java.lang.String[] getValidValues()`
- `public int getInt()`
- `public int getInt(int _default)`
- `public boolean isIntValue()`
- `public long getLong()`
- `public long getLong(long _default)`
- `public boolean isLongValue()`
- `public boolean getBoolean(boolean _default)`
- `public boolean getBoolean()`
- `public boolean isBooleanValue()`
- `public boolean isDoubleValue()`
- `public double getDouble(double _default)`
- `public double getDouble()`
- `public java.lang.String[] getStringList()`
- `public int[] getIntList()`
- `public boolean isIntList()`
- `public boolean[] getBooleanList()`
- `public boolean isBooleanList()`
- `public double[] getDoubleList()`
- `public boolean isDoubleList()`
- `public java.lang.String getName()`
- `public void setName(java.lang.String name)`
- `public boolean wasRead()`
- `public Property.Type getType()`
- `public boolean isList()`
- `public boolean hasChanged()`
- `public Property setValue(java.lang.String value)`
- `public void set(java.lang.String value)`
- `public Property setValues(java.lang.String[] values)`
- `public void set(java.lang.String[] values)`
- `public Property setValue(int value)`
- `public Property setValue(boolean value)`
- `public Property setValue(double value)`
- `public Property setValues(boolean[] values)`
- `public void set(boolean[] values)`
- `public Property setValues(int[] values)`
- `public void set(int[] values)`
- `public Property setValues(double[] values)`
- `public void set(double[] values)`
- `public void set(int value)`
- `public void set(long value)`
- `public void set(boolean value)`
- `public void set(double value)`

## Description

Gets the custom IArrayEntry class that should be used in place of the standard entry class for this Property type, or null if none has been set.
