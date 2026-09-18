---
title: "PropertyManager"
description: "public class PropertyManager extends java.lang.Object"
package: "net/minecraft/server/dedicated"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/server/dedicated/PropertyManager.html"
sourceType: javadoc
---

# PropertyManager

## Class signature

```java
public class PropertyManager extends java.lang.Object
```

## Constructors

- `public PropertyManager(java.io.File propertiesFile)`

## Methods

- `public void generateNewProperties()`
- `public void saveProperties()`
- `public java.io.File getPropertiesFile()`
- `public java.lang.String getStringProperty(java.lang.String key, java.lang.String defaultValue)`
- `public int getIntProperty(java.lang.String key, int defaultValue)`
- `public long getLongProperty(java.lang.String key, long defaultValue)`
- `public boolean getBooleanProperty(java.lang.String key, boolean defaultValue)`
- `public void setProperty(java.lang.String key, java.lang.Object value)`
- `public boolean hasProperty(java.lang.String key)`
- `public void removeProperty(java.lang.String key)`
