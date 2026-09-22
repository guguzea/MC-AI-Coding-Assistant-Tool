---
title: "Configuration"
description: "public class Configuration extends java.lang.Object"
package: "net/minecraftforge/common/config"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/common/config/Configuration.html"
sourceType: javadoc
---

# Configuration

**Inheritance:** java.lang.Object → net.minecraftforge.common.config.Configuration

## Class signature

```java
public class Configuration extends java.lang.Object
```

## Constructors

- `Configuration()`
- `Configuration(java.io.File file)`
- `Configuration(java.io.File file, boolean caseSensitiveCustomCategories)`
- `Configuration(java.io.File file, java.lang.String configVersion)`
- `Configuration(java.io.File file, java.lang.String configVersion, boolean caseSensitiveCustomCategories)`

## Methods

- `void addCustomCategoryComment(java.lang.String category, java.lang.String comment)`
- `void copyCategoryProps(Configuration fromConfig, java.lang.String[] ctgys)` — Copies property objects from another Configuration object to this one using the list of category names.
- `static void enableGlobalConfig()`
- `Property get(java.lang.String category, java.lang.String key, boolean defaultValue)` — Gets a boolean Property object without a comment using the default settings.
- `Property get(java.lang.String category, java.lang.String key, boolean[] defaultValues)` — Gets a boolean array Property without a comment using the default settings.
- `Property get(java.lang.String category, java.lang.String key, boolean[] defaultValues, java.lang.String comment)` — Gets a boolean array Property with a comment using the default settings.
- `Property get(java.lang.String category, java.lang.String key, boolean[] defaultValues, java.lang.String comment, boolean isListLengthFixed, int maxListLength)` — Gets a boolean array Property with all settings defined.
- `Property get(java.lang.String category, java.lang.String key, boolean defaultValue, java.lang.String comment)` — Gets a boolean Property object with a comment using the default settings.
- `Property get(java.lang.String category, java.lang.String key, double defaultValue)` — Gets a double Property object without a comment using default settings.
- `Property get(java.lang.String category, java.lang.String key, double[] defaultValues)` — Gets a double array Property object without a comment using default settings.
- `Property get(java.lang.String category, java.lang.String key, double[] defaultValues, java.lang.String comment)` — Gets a double array Property object without a comment using default settings.
- `Property get(java.lang.String category, java.lang.String key, double[] defaultValues, java.lang.String comment, double minValue, double maxValue)` — Gets a double array Property object with the defined comment, minimum and maximum bounds.
- `Property get(java.lang.String category, java.lang.String key, double[] defaultValues, java.lang.String comment, double minValue, double maxValue, boolean isListLengthFixed, int maxListLength)` — Gets a double array Property object with all settings defined.
- `Property get(java.lang.String category, java.lang.String key, double defaultValue, java.lang.String comment)` — Gets a double Property object with a comment using default settings.
- `Property get(java.lang.String category, java.lang.String key, double defaultValue, java.lang.String comment, double minValue, double maxValue)` — Gets a double Property object with the defined comment, minimum and maximum bounds
- `Property get(java.lang.String category, java.lang.String key, int defaultValue)` — Gets an integer Property object without a comment using default settings.
- `Property get(java.lang.String category, java.lang.String key, int[] defaultValues)` — Gets an integer array Property object without a comment using default settings.
- `Property get(java.lang.String category, java.lang.String key, int[] defaultValues, java.lang.String comment)` — Gets an integer array Property object with a comment using default settings.
- `Property get(java.lang.String category, java.lang.String key, int[] defaultValues, java.lang.String comment, int minValue, int maxValue)` — Gets an integer array Property object with the defined comment, minimum and maximum bounds.
- `Property get(java.lang.String category, java.lang.String key, int[] defaultValues, java.lang.String comment, int minValue, int maxValue, boolean isListLengthFixed, int maxListLength)` — Gets an integer array Property object with all settings defined.
- `Property get(java.lang.String category, java.lang.String key, int defaultValue, java.lang.String comment)` — Gets an integer Property object with a comment using default settings.
- `Property get(java.lang.String category, java.lang.String key, int defaultValue, java.lang.String comment, int minValue, int maxValue)` — Gets an integer Property object with the defined comment, minimum and maximum bounds.
- `Property get(java.lang.String category, java.lang.String key, java.lang.String defaultValue)` — Gets a string Property without a comment using the default settings.
- `Property get(java.lang.String category, java.lang.String key, java.lang.String[] defaultValues)` — Gets a string array Property without a comment using the default settings.
- `Property get(java.lang.String category, java.lang.String key, java.lang.String[] defaultValues, java.lang.String comment)` — Gets a string array Property with a comment using the default settings.
- `Property get(java.lang.String category, java.lang.String key, java.lang.String[] defaultValues, java.lang.String comment, boolean isListLengthFixed, int maxListLength, java.util.regex.Pattern validationPattern)` — Gets a string array Property with a comment with all settings defined.
- `Property get(java.lang.String category, java.lang.String key, java.lang.String[] defaultValues, java.lang.String comment, java.util.regex.Pattern validationPattern)` — Gets a string array Property with a comment using the defined validationPattern and otherwise default settings.
- `Property get(java.lang.String category, java.lang.String key, java.lang.String[] defaultValues, java.lang.String comment, Property.Type type)` — Gets a list (array) Property object of the specified type using default settings.
- `Property get(java.lang.String category, java.lang.String key, java.lang.String defaultValue, java.lang.String comment)` — Gets a string Property with a comment using the default settings.
- `Property get(java.lang.String category, java.lang.String key, java.lang.String defaultValue, java.lang.String comment, java.util.regex.Pattern validationPattern)` — Gets a string Property with a comment using the defined validationPattern and otherwise default settings.
- `Property get(java.lang.String category, java.lang.String key, java.lang.String defaultValue, java.lang.String comment, Property.Type type)` — Gets a Property object of the specified type using default settings.
- `Property get(java.lang.String category, java.lang.String key, java.lang.String defaultValue, java.lang.String comment, java.lang.String[] validValues)` — Gets a string Property with a comment using the defined validValues array and otherwise default settings.
- `boolean getBoolean(java.lang.String name, java.lang.String category, boolean defaultValue, java.lang.String comment)` — Creates a boolean property.
- `boolean getBoolean(java.lang.String name, java.lang.String category, boolean defaultValue, java.lang.String comment, java.lang.String langKey)` — Creates a boolean property.
- `ConfigCategory getCategory(java.lang.String category)`
- `java.util.Set<java.lang.String> getCategoryNames()`
- `java.io.File getConfigFile()`
- `java.lang.String getDefinedConfigVersion()`
- `float getFloat(java.lang.String name, java.lang.String category, float defaultValue, float minValue, float maxValue, java.lang.String comment)` — Creates a float property.
- `float getFloat(java.lang.String name, java.lang.String category, float defaultValue, float minValue, float maxValue, java.lang.String comment, java.lang.String langKey)` — Creates a float property.
- `int getInt(java.lang.String name, java.lang.String category, int defaultValue, int minValue, int maxValue, java.lang.String comment)` — Creates a integer property.
- `int getInt(java.lang.String name, java.lang.String category, int defaultValue, int minValue, int maxValue, java.lang.String comment, java.lang.String langKey)` — Creates a integer property.
- `java.lang.String getLoadedConfigVersion()`
- `java.lang.String getString(java.lang.String name, java.lang.String category, java.lang.String defaultValue, java.lang.String comment)` — Creates a string property.
- `java.lang.String getString(java.lang.String name, java.lang.String category, java.lang.String defaultValue, java.lang.String comment, java.util.regex.Pattern pattern)` — Creates a string property.
- `java.lang.String getString(java.lang.String name, java.lang.String category, java.lang.String defaultValue, java.lang.String comment, java.lang.String langKey)` — Creates a string property.
- `java.lang.String getString(java.lang.String name, java.lang.String category, java.lang.String defaultValue, java.lang.String comment, java.lang.String[] validValues)` — Creates a string property.
- `java.lang.String getString(java.lang.String name, java.lang.String category, java.lang.String defaultValue, java.lang.String comment, java.lang.String[] validValues, java.lang.String langKey)` — Creates a string property.
- `java.lang.String getString(java.lang.String name, java.lang.String category, java.lang.String defaultValue, java.lang.String comment, java.lang.String langKey, java.util.regex.Pattern pattern)` — Creates a string property.
- `java.lang.String[] getStringList(java.lang.String name, java.lang.String category, java.lang.String[] defaultValues, java.lang.String comment)` — Creates a string list property.
- `java.lang.String[] getStringList(java.lang.String name, java.lang.String category, java.lang.String[] defaultValue, java.lang.String comment, java.lang.String[] validValues)` — Creates a string list property.
- `java.lang.String[] getStringList(java.lang.String name, java.lang.String category, java.lang.String[] defaultValue, java.lang.String comment, java.lang.String[] validValues, java.lang.String langKey)` — Creates a string list property.
- `boolean hasCategory(java.lang.String category)`
- `boolean hasChanged()`
- `boolean hasKey(java.lang.String category, java.lang.String key)`
- `void load()`
- `boolean moveProperty(java.lang.String oldCategory, java.lang.String propName, java.lang.String newCategory)` — Moves a property from one category to another.
- `void removeCategory(ConfigCategory category)`
- `boolean renameProperty(java.lang.String category, java.lang.String oldPropName, java.lang.String newPropName)` — Renames a property in a given category.
- `void save()`
- `Configuration setCategoryComment(java.lang.String category, java.lang.String comment)` — Adds a comment to the specified ConfigCategory object
- `Configuration setCategoryConfigEntryClass(java.lang.String category, java.lang.Class<? extends GuiConfigEntries.IConfigEntry> clazz)` — Sets the custom IConfigEntry class that should be used in place of the standard entry class (which is just a button that navigates into the category).
- `Configuration setCategoryLanguageKey(java.lang.String category, java.lang.String langKey)` — Adds a language key to the specified ConfigCategory object
- `Configuration setCategoryPropertyOrder(java.lang.String category, java.util.List<java.lang.String> propOrder)` — Sets the order that direct child properties of this config category will be written to the config file and will be displayed in config GUIs.
- `Configuration setCategoryRequiresMcRestart(java.lang.String category, boolean requiresMcRestart)` — Sets whether or not this ConfigCategory requires Minecraft to be restarted when changed.
- `Configuration setCategoryRequiresWorldRestart(java.lang.String category, boolean requiresWorldRestart)` — Sets the flag for whether or not this category can be edited while a world is running.
- `java.lang.String toString()`

## Fields

- `static java.lang.String ALLOWED_CHARS`
- `static com.google.common.base.CharMatcher allowedProperties`
- `static java.lang.String CATEGORY_CLIENT`
- `static java.lang.String CATEGORY_GENERAL`
- `static java.lang.String CATEGORY_SPLITTER`
- `static java.lang.String COMMENT_SEPARATOR`
- `static java.lang.String DEFAULT_ENCODING`
- `java.lang.String defaultEncoding`
- `boolean isChild`
- `static java.lang.String NEW_LINE`
