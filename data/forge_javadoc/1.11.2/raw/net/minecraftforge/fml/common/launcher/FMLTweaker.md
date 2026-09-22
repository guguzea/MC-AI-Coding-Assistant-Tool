---
title: "FMLTweaker"
description: "public class FMLTweaker extends java.lang.Object implements net.minecraft.launchwrapper.ITweaker"
package: "net/minecraftforge/fml/common/launcher"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/common/launcher/FMLTweaker.html"
sourceType: javadoc
---

# FMLTweaker

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.launcher.FMLTweaker

## Class signature

```java
public class FMLTweaker extends java.lang.Object implements net.minecraft.launchwrapper.ITweaker
```

## Constructors

- `FMLTweaker()`

## Methods

- `void acceptOptions(java.util.List<java.lang.String> args, java.io.File gameDir, java.io.File assetsDir, java.lang.String profile)`
- `java.io.File getGameDir()`
- `static java.net.URI getJarLocation()`
- `java.lang.String[] getLaunchArguments()`
- `java.lang.String getLaunchTarget()`
- `void injectCascadingTweak(java.lang.String tweakClassName)`
- `void injectIntoClassLoader(net.minecraft.launchwrapper.LaunchClassLoader classLoader)`
