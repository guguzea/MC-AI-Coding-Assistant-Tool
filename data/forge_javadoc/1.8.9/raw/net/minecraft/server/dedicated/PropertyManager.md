---
title: "PropertyManager"
description: "public class PropertyManager extends java.lang.Object"
package: "net/minecraft/server/dedicated"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/server/dedicated/PropertyManager.html"
sourceType: javadoc
---

# PropertyManager

**Inheritance:** java.lang.Object → net.minecraft.server.dedicated.PropertyManager

## Class signature

```java
public class PropertyManager extends java.lang.Object
```

## Constructors

- `PropertyManager(java.io.File propertiesFile)`

## Methods

- `void generateNewProperties()` — Generates a new properties file.
- `boolean getBooleanProperty(java.lang.String key, boolean defaultValue)` — Gets a boolean property.
- `int getIntProperty(java.lang.String key, int defaultValue)` — Gets an integer property.
- `long getLongProperty(java.lang.String key, long defaultValue)`
- `java.io.File getPropertiesFile()` — Returns this PropertyManager's file object used for property saving.
- `java.lang.String getStringProperty(java.lang.String key, java.lang.String defaultValue)` — Returns a string property.
- `void saveProperties()` — Writes the properties to the properties file.
- `void setProperty(java.lang.String key, java.lang.Object value)` — Saves an Object with the given property name.
