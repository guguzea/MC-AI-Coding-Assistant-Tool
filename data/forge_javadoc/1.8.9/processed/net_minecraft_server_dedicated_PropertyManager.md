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

## Description

Generates a new properties file.