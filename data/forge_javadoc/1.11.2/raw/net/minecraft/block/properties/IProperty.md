---
title: "IProperty"
description: "public interface IProperty<T extends java.lang.Comparable<T>>"
package: "net/minecraft/block/properties"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/properties/IProperty.html"
sourceType: javadoc
---

# IProperty

## Class signature

```java
public interface IProperty<T extends java.lang.Comparable<T>>
```

## Methods

- `java.lang.String getName()`
- `java.util.Collection< T > getAllowedValues()`
- `java.lang.Class< T > getValueClass()`
- `com.google.common.base.Optional< T > parseValue(java.lang.String value)`
- `java.lang.String getName( T value)`
