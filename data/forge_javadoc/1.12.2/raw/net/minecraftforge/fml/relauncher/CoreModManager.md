---
title: "CoreModManager"
description: "public class CoreModManager extends java.lang.Object"
package: "net/minecraftforge/fml/relauncher"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/relauncher/CoreModManager.html"
sourceType: javadoc
---

# CoreModManager

## Class signature

```java
public class CoreModManager extends java.lang.Object
```

## Constructors

- `public CoreModManager()`

## Methods

- `public static void handleLaunch(java.io.File mcDir, LaunchClassLoader classLoader, FMLTweaker tweaker)`
- `public static java.util.List<java.lang.String> getIgnoredMods()`
- `public static java.util.Map<java.lang.String,java.util.List<java.lang.String>> getTransformers()`
- `public static java.util.List<java.lang.String> getReparseableCoremods()`
- `public static void injectTransformers(LaunchClassLoader classLoader)`
- `public static void injectCoreModTweaks( FMLInjectionAndSortingTweaker fmlInjectionAndSortingTweaker)`
- `public static void sortTweakList()`
- `public static java.util.List<java.lang.String> getAccessTransformers()`
- `public static void onCrash(java.lang.StringBuilder builder)`
