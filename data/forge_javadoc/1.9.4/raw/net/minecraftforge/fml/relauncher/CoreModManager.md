---
title: "CoreModManager"
description: "public class CoreModManager extends java.lang.Object"
package: "net/minecraftforge/fml/relauncher"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/relauncher/CoreModManager.html"
sourceType: javadoc
---

# CoreModManager

**Inheritance:** java.lang.Object → net.minecraftforge.fml.relauncher.CoreModManager

## Class signature

```java
public class CoreModManager extends java.lang.Object
```

## Constructors

- `CoreModManager()`

## Methods

- `static java.util.List<java.lang.String> getAccessTransformers()`
- `static java.util.List<java.lang.String> getIgnoredMods()`
- `static java.util.List<java.lang.String> getReparseableCoremods()`
- `static java.util.Map<java.lang.String, java.util.List<java.lang.String>> getTransformers()`
- `static void handleLaunch(java.io.File mcDir, net.minecraft.launchwrapper.LaunchClassLoader classLoader, FMLTweaker tweaker)`
- `static void injectCoreModTweaks(FMLInjectionAndSortingTweaker fmlInjectionAndSortingTweaker)`
- `static void injectTransformers(net.minecraft.launchwrapper.LaunchClassLoader classLoader)`
- `static void onCrash(java.lang.StringBuilder builder)`
- `static void sortTweakList()`
