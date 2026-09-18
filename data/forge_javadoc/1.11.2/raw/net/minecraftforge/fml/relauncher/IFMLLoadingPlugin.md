---
title: "IFMLLoadingPlugin"
description: "The base plugin that provides class name meta information to FML to enhance the classloading lifecycle for mods in FML"
package: "net/minecraftforge/fml/relauncher"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/relauncher/IFMLLoadingPlugin.html"
sourceType: javadoc
---

# IFMLLoadingPlugin

## Class signature

```java
public interface IFMLLoadingPlugin
```

## Methods

- `java.lang.String[] getASMTransformerClass()`
- `java.lang.String getModContainerClass()`
- `@Nullable java.lang.String getSetupClass()`
- `void injectData(java.util.Map<java.lang.String,java.lang.Object> data)`
- `java.lang.String getAccessTransformerClass()`

## Description

The base plugin that provides class name meta information to FML to enhance the classloading lifecycle for mods in FML
