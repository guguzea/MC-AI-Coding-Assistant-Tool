---
title: "ConfigCategory"
description: "public class ConfigCategory extends java.lang.Object implements java.util.Map<java.lang.String, Property>"
package: "net/minecraftforge/common/config"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/common/config/ConfigCategory.html"
sourceType: javadoc
---

# ConfigCategory

**Inheritance:** java.lang.Object → net.minecraftforge.common.config.ConfigCategory

## Class signature

```java
public class ConfigCategory extends java.lang.Object implements java.util.Map<java.lang.String, Property>
```

## Constructors

- `ConfigCategory(java.lang.String name)`
- `ConfigCategory(java.lang.String name, ConfigCategory parent)`

## Methods

- `void clear()`
- `boolean containsKey(java.lang.Object key)`
- `boolean containsKey(java.lang.String key)`
- `boolean containsValue(java.lang.Object value)`
- `java.util.Set<java.util.Map.Entry<java.lang.String, Property>> entrySet()`
- `boolean equals(java.lang.Object obj)`
- `Property get(java.lang.Object key)`
- `Property get(java.lang.String key)`
- `java.util.Set<ConfigCategory> getChildren()`
- `java.lang.String getComment()`
- `java.lang.Class<? extends GuiConfigEntries.IConfigEntry> getConfigEntryClass()`
- `ConfigCategory getFirstParent()`
- `java.lang.String getLanguagekey()`
- `java.lang.String getName()`
- `java.util.List<Property> getOrderedValues()`
- `java.util.List<java.lang.String> getPropertyOrder()`
- `java.lang.String getQualifiedName()`
- `static java.lang.String getQualifiedName(java.lang.String name, ConfigCategory parent)`
- `java.util.Map<java.lang.String, Property> getValues()`
- `boolean hasChanged()`
- `boolean isChild()`
- `boolean isEmpty()`
- `java.util.Set<java.lang.String> keySet()`
- `Property put(java.lang.String key, Property value)`
- `void putAll(java.util.Map<? extends java.lang.String, ? extends Property> m)`
- `Property remove(java.lang.Object key)`
- `void removeChild(ConfigCategory child)`
- `boolean requiresMcRestart()` — Gets whether or not this ConfigCategory requires Minecraft to be restarted when changed.
- `boolean requiresWorldRestart()` — Returns whether or not this category is able to be edited while a world is running using the in-game Mod Options screen as well as the Mods list screen, or only from the Mods list screen.
- `void setComment(java.lang.String comment)`
- `ConfigCategory setConfigEntryClass(java.lang.Class<? extends GuiConfigEntries.IConfigEntry> clazz)`
- `ConfigCategory setLanguageKey(java.lang.String languagekey)`
- `ConfigCategory setPropertyOrder(java.util.List<java.lang.String> propertyOrder)`
- `ConfigCategory setRequiresMcRestart(boolean requiresMcRestart)` — Sets whether or not this ConfigCategory requires Minecraft to be restarted when changed.
- `ConfigCategory setRequiresWorldRestart(boolean requiresWorldRestart)` — Sets the flag for whether or not this category can be edited while a world is running.
- `ConfigCategory setShowInGui(boolean showInGui)` — Sets whether or not this ConfigCategory should be allowed to show on config GUIs.
- `boolean showInGui()` — Gets whether or not this ConfigCategory should be allowed to show on config GUIs.
- `int size()`
- `java.util.Collection<Property> values()`
- `void write(java.io.BufferedWriter out, int indent)`

## Fields

- `ConfigCategory parent`
