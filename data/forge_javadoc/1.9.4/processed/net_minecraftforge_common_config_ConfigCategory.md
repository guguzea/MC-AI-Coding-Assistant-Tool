# ConfigCategory

## Class signature

```java
public class ConfigCategory extends java.lang.Object implements java.util.Map<java.lang.String, Property >
```

## Constructors

- `public ConfigCategory(java.lang.String name)`
- `public ConfigCategory(java.lang.String name, ConfigCategory parent)`

## Methods

- `public boolean equals(java.lang.Object obj)`
- `public java.lang.String getName()`
- `public java.lang.String getQualifiedName()`
- `public static java.lang.String getQualifiedName(java.lang.String name, ConfigCategory parent)`
- `public ConfigCategory getFirstParent()`
- `public boolean isChild()`
- `public java.util.Map<java.lang.String, Property > getValues()`
- `public java.util.List< Property > getOrderedValues()`
- `public ConfigCategory setConfigEntryClass(java.lang.Class<? extends GuiConfigEntries.IConfigEntry > clazz)`
- `public java.lang.Class<? extends GuiConfigEntries.IConfigEntry > getConfigEntryClass()`
- `public ConfigCategory setLanguageKey(java.lang.String languagekey)`
- `public java.lang.String getLanguagekey()`
- `public void setComment(java.lang.String comment)`
- `public java.lang.String getComment()`
- `public ConfigCategory setRequiresWorldRestart(boolean requiresWorldRestart)`
- `public boolean requiresWorldRestart()`
- `public ConfigCategory setShowInGui(boolean showInGui)`
- `public boolean showInGui()`
- `public ConfigCategory setRequiresMcRestart(boolean requiresMcRestart)`
- `public boolean requiresMcRestart()`
- `public ConfigCategory setPropertyOrder(java.util.List<java.lang.String> propertyOrder)`
- `public java.util.List<java.lang.String> getPropertyOrder()`
- `public boolean containsKey(java.lang.String key)`
- `public Property get(java.lang.String key)`
- `public void write(java.io.BufferedWriter out, int indent) throws java.io.IOException`
- `public boolean hasChanged()`
- `public int size()`
- `public boolean isEmpty()`
- `public boolean containsKey(java.lang.Object key)`
- `public boolean containsValue(java.lang.Object value)`
- `public Property get(java.lang.Object key)`
- `public Property put(java.lang.String key, Property value)`
- `public Property remove(java.lang.Object key)`
- `public void putAll(java.util.Map<? extends java.lang.String,? extends Property > m)`
- `public void clear()`
- `public java.util.Set<java.lang.String> keySet()`
- `public java.util.Collection< Property > values()`
- `public java.util.Set<java.util.Map.Entry<java.lang.String, Property >> entrySet()`
- `public java.util.Set< ConfigCategory > getChildren()`
- `public void removeChild( ConfigCategory child)`

## Description

Gets whether or not this ConfigCategory requires Minecraft to be restarted when changed.