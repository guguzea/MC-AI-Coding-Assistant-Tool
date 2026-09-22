# PropertyManager

**Inheritance:** java.lang.Object → net.minecraft.server.dedicated.PropertyManager

## Class signature

```java
public class PropertyManager extends java.lang.Object
```

## Constructors

- `PropertyManager(java.io.File propertiesFile)`

## Methods

- `void generateNewProperties()`
- `boolean getBooleanProperty(java.lang.String key, boolean defaultValue)`
- `int getIntProperty(java.lang.String key, int defaultValue)`
- `long getLongProperty(java.lang.String key, long defaultValue)`
- `java.io.File getPropertiesFile()`
- `java.lang.String getStringProperty(java.lang.String key, java.lang.String defaultValue)`
- `boolean hasProperty(java.lang.String key)`
- `void removeProperty(java.lang.String key)`
- `void saveProperties()`
- `void setProperty(java.lang.String key, java.lang.Object value)`