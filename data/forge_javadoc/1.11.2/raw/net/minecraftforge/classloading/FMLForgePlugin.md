---
title: "FMLForgePlugin"
description: "Return an optional access transformer class for this coremod."
package: "net/minecraftforge/classloading"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/classloading/FMLForgePlugin.html"
sourceType: javadoc
---

# FMLForgePlugin

## Class signature

```java
public class FMLForgePlugin extends java.lang.Object implements IFMLLoadingPlugin
```

## Constructors

- `public FMLForgePlugin()`

## Methods

- `public java.lang.String[] getASMTransformerClass()`
- `public java.lang.String getModContainerClass()`
- `@Nullable public java.lang.String getSetupClass()`
- `public void injectData(java.util.Map<java.lang.String,java.lang.Object> data)`
- `public java.lang.String getAccessTransformerClass()`

## Description

Return an optional access transformer class for this coremod.
