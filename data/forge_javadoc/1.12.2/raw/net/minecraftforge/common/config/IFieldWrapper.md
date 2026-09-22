---
title: "IFieldWrapper"
description: "public interface IFieldWrapper"
package: "net/minecraftforge/common/config"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/config/IFieldWrapper.html"
sourceType: javadoc
---

# IFieldWrapper

## Class signature

```java
public interface IFieldWrapper
```

## Methods

- `java.lang.String getCategory()` — i.e. general.map in the example above
- `java.lang.String[] getKeys()`
- `net.minecraftforge.common.config.ITypeAdapter getTypeAdapter()`
- `java.lang.Object getValue(java.lang.String key)`
- `boolean handlesKey(java.lang.String key)`
- `boolean hasKey(java.lang.String key)`
- `@Deprecated void setupConfiguration(Configuration cfg, java.lang.String desc, java.lang.String langKey, boolean reqMCRestart, boolean reqWorldRestart)`
- `default void setupConfiguration(Configuration cfg, java.lang.String desc, java.lang.String langKey, boolean reqMCRestart, boolean reqWorldRestart, boolean hasSlidingControl)`
- `void setValue(java.lang.String key, java.lang.Object value)`
