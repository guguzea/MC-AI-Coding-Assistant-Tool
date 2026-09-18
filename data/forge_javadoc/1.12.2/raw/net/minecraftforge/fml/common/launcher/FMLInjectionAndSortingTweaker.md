---
title: "FMLInjectionAndSortingTweaker"
description: "This class is to manage the injection of coremods as tweakers into the tweak framework. It has to inject the coremod tweaks during construction, because that is the only time the tweak list is writeab"
package: "net/minecraftforge/fml/common/launcher"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/launcher/FMLInjectionAndSortingTweaker.html"
sourceType: javadoc
---

# FMLInjectionAndSortingTweaker

## Class signature

```java
public class FMLInjectionAndSortingTweaker extends java.lang.Object
```

## Constructors

- `public FMLInjectionAndSortingTweaker()`

## Methods

- `public void acceptOptions(java.util.List<java.lang.String> args, java.io.File gameDir, java.io.File assetsDir, java.lang.String profile)`
- `public void injectIntoClassLoader(LaunchClassLoader classLoader)`
- `public java.lang.String getLaunchTarget()`
- `public java.lang.String[] getLaunchArguments()`

## Description

This class is to manage the injection of coremods as tweakers into the tweak framework. It has to inject the coremod tweaks during construction, because that is the only time the tweak list is writeab
