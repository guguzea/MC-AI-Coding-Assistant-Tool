---
title: "IFieldWrapper"
description: "The objects are expected to get their wrapped field, the owning class, instance and category string on initialization. In general: The key is the fully qualified property name, where each subcategory "
package: "net/minecraftforge/common/config"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/config/IFieldWrapper.html"
sourceType: javadoc
---

# IFieldWrapper

## Class signature

```java
public interface IFieldWrapper
```

## Methods

- `net.minecraftforge.common.config.ITypeAdapter getTypeAdapter()`
- `java.lang.String[] getKeys()`
- `java.lang.Object getValue(java.lang.String key)`
- `void setValue(java.lang.String key, java.lang.Object value)`
- `boolean hasKey(java.lang.String key)`
- `boolean handlesKey(java.lang.String key)`
- `@Deprecated void setupConfiguration( Configuration cfg, java.lang.String desc, java.lang.String langKey, boolean reqMCRestart, boolean reqWorldRestart)`
- `default void setupConfiguration( Configuration cfg, java.lang.String desc, java.lang.String langKey, boolean reqMCRestart, boolean reqWorldRestart, boolean hasSlidingControl)`
- `java.lang.String getCategory()`

## Description

The objects are expected to get their wrapped field, the owning class, instance and category string on initialization. In general: The key is the fully qualified property name, where each subcategory 
