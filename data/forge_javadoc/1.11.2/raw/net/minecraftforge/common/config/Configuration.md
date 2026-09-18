---
title: "Configuration"
description: "This class offers advanced configurations capabilities, allowing to provide various categories for configuration variables."
package: "net/minecraftforge/common/config"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/common/config/Configuration.html"
sourceType: javadoc
---

# Configuration

## Class signature

```java
public class Configuration extends java.lang.Object
```

## Constructors

- `public Configuration()`
- `public Configuration(java.io.File file)`
- `public Configuration(java.io.File file, java.lang.String configVersion)`
- `public Configuration(java.io.File file, java.lang.String configVersion, boolean caseSensitiveCustomCategories)`
- `public Configuration(java.io.File file, boolean caseSensitiveCustomCategories)`

## Methods

- `public java.lang.String toString()`
- `public java.lang.String getDefinedConfigVersion()`
- `public java.lang.String getLoadedConfigVersion()`
- `public Property get(java.lang.String category, java.lang.String key, boolean defaultValue)`
- `public Property get(java.lang.String category, java.lang.String key, boolean defaultValue, java.lang.String comment)`
- `public Property get(java.lang.String category, java.lang.String key, boolean[] defaultValues)`
- `public Property get(java.lang.String category, java.lang.String key, boolean[] defaultValues, java.lang.String comment)`
- `public Property get(java.lang.String category, java.lang.String key, boolean[] defaultValues, java.lang.String comment, boolean isListLengthFixed, int maxListLength)`
- `public Property get(java.lang.String category, java.lang.String key, int defaultValue)`
- `public Property get(java.lang.String category, java.lang.String key, int defaultValue, java.lang.String comment)`
- `public Property get(java.lang.String category, java.lang.String key, int defaultValue, java.lang.String comment, int minValue, int maxValue)`
- `public Property get(java.lang.String category, java.lang.String key, int[] defaultValues)`
- `public Property get(java.lang.String category, java.lang.String key, int[] defaultValues, java.lang.String comment)`
- `public Property get(java.lang.String category, java.lang.String key, int[] defaultValues, java.lang.String comment, int minValue, int maxValue)`
- `public Property get(java.lang.String category, java.lang.String key, int[] defaultValues, java.lang.String comment, int minValue, int maxValue, boolean isListLengthFixed, int maxListLength)`
- `public Property get(java.lang.String category, java.lang.String key, double defaultValue)`
- `public Property get(java.lang.String category, java.lang.String key, double defaultValue, java.lang.String comment)`
- `public Property get(java.lang.String category, java.lang.String key, double defaultValue, java.lang.String comment, double minValue, double maxValue)`
- `public Property get(java.lang.String category, java.lang.String key, double[] defaultValues)`
- `public Property get(java.lang.String category, java.lang.String key, double[] defaultValues, java.lang.String comment)`
- `public Property get(java.lang.String category, java.lang.String key, double[] defaultValues, java.lang.String comment, double minValue, double maxValue)`
- `public Property get(java.lang.String category, java.lang.String key, double[] defaultValues, java.lang.String comment, double minValue, double maxValue, boolean isListLengthFixed, int maxListLength)`
- `public Property get(java.lang.String category, java.lang.String key, java.lang.String defaultValue)`
- `public Property get(java.lang.String category, java.lang.String key, java.lang.String defaultValue, java.lang.String comment)`
- `public Property get(java.lang.String category, java.lang.String key, java.lang.String defaultValue, java.lang.String comment, java.util.regex.Pattern validationPattern)`
- `public Property get(java.lang.String category, java.lang.String key, java.lang.String defaultValue, java.lang.String comment, java.lang.String[] validValues)`
- `public Property get(java.lang.String category, java.lang.String key, java.lang.String[] defaultValues)`
- `public Property get(java.lang.String category, java.lang.String key, java.lang.String[] defaultValues, java.lang.String comment)`
- `public Property get(java.lang.String category, java.lang.String key, java.lang.String[] defaultValues, java.lang.String comment, java.util.regex.Pattern validationPattern)`
- `public Property get(java.lang.String category, java.lang.String key, java.lang.String[] defaultValues, java.lang.String comment, boolean isListLengthFixed, int maxListLength, java.util.regex.Pattern validationPattern)`
- `public Property get(java.lang.String category, java.lang.String key, java.lang.String defaultValue, java.lang.String comment, Property.Type type)`
- `public Property get(java.lang.String category, java.lang.String key, java.lang.String[] defaultValues, java.lang.String comment, Property.Type type)`
- `public boolean hasCategory(java.lang.String category)`
- `public boolean hasKey(java.lang.String category, java.lang.String key)`
- `public void load()`
- `public void save()`
- `public ConfigCategory getCategory(java.lang.String category)`
- `public void removeCategory( ConfigCategory category)`
- `public Configuration setCategoryComment(java.lang.String category, java.lang.String comment)`
- `public void addCustomCategoryComment(java.lang.String category, java.lang.String comment)`
- `public Configuration setCategoryLanguageKey(java.lang.String category, java.lang.String langKey)`
- `public Configuration setCategoryConfigEntryClass(java.lang.String category, java.lang.Class<? extends GuiConfigEntries.IConfigEntry > clazz)`
- `public Configuration setCategoryRequiresWorldRestart(java.lang.String category, boolean requiresWorldRestart)`
- `public Configuration setCategoryRequiresMcRestart(java.lang.String category, boolean requiresMcRestart)`
- `public Configuration setCategoryPropertyOrder(java.lang.String category, java.util.List<java.lang.String> propOrder)`
- `public static void enableGlobalConfig()`
- `public boolean hasChanged()`
- `public java.util.Set<java.lang.String> getCategoryNames()`
- `public boolean renameProperty(java.lang.String category, java.lang.String oldPropName, java.lang.String newPropName)`
- `public boolean moveProperty(java.lang.String oldCategory, java.lang.String propName, java.lang.String newCategory)`
- `public void copyCategoryProps( Configuration fromConfig, java.lang.String[] ctgys)`
- `public java.lang.String getString(java.lang.String name, java.lang.String category, java.lang.String defaultValue, java.lang.String comment)`
- `public java.lang.String getString(java.lang.String name, java.lang.String category, java.lang.String defaultValue, java.lang.String comment, java.lang.String langKey)`
- `public java.lang.String getString(java.lang.String name, java.lang.String category, java.lang.String defaultValue, java.lang.String comment, java.util.regex.Pattern pattern)`
- `public java.lang.String getString(java.lang.String name, java.lang.String category, java.lang.String defaultValue, java.lang.String comment, java.lang.String langKey, java.util.regex.Pattern pattern)`
- `public java.lang.String getString(java.lang.String name, java.lang.String category, java.lang.String defaultValue, java.lang.String comment, java.lang.String[] validValues)`
- `public java.lang.String getString(java.lang.String name, java.lang.String category, java.lang.String defaultValue, java.lang.String comment, java.lang.String[] validValues, java.lang.String langKey)`
- `public java.lang.String[] getStringList(java.lang.String name, java.lang.String category, java.lang.String[] defaultValues, java.lang.String comment)`
- `public java.lang.String[] getStringList(java.lang.String name, java.lang.String category, java.lang.String[] defaultValue, java.lang.String comment, java.lang.String[] validValues)`
- `public java.lang.String[] getStringList(java.lang.String name, java.lang.String category, java.lang.String[] defaultValue, java.lang.String comment, java.lang.String[] validValues, java.lang.String langKey)`
- `public boolean getBoolean(java.lang.String name, java.lang.String category, boolean defaultValue, java.lang.String comment)`
- `public boolean getBoolean(java.lang.String name, java.lang.String category, boolean defaultValue, java.lang.String comment, java.lang.String langKey)`
- `public int getInt(java.lang.String name, java.lang.String category, int defaultValue, int minValue, int maxValue, java.lang.String comment)`
- `public int getInt(java.lang.String name, java.lang.String category, int defaultValue, int minValue, int maxValue, java.lang.String comment, java.lang.String langKey)`
- `public float getFloat(java.lang.String name, java.lang.String category, float defaultValue, float minValue, float maxValue, java.lang.String comment)`
- `public float getFloat(java.lang.String name, java.lang.String category, float defaultValue, float minValue, float maxValue, java.lang.String comment, java.lang.String langKey)`
- `public java.io.File getConfigFile()`

## Description

This class offers advanced configurations capabilities, allowing to provide various categories for configuration variables.
