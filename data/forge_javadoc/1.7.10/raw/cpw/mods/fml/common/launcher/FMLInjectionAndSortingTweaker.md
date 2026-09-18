---
title: "FMLInjectionAndSortingTweaker"
description: "This class is to manage the injection of coremods as tweakers into the tweak framework. It has to inject the coremod tweaks during construction, because that is the only time the tweak list is writeab"
package: "cpw/mods/fml/common/launcher"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/launcher/FMLInjectionAndSortingTweaker.html"
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
