---
title: "FMLTweaker"
description: "public class FMLTweaker extends java.lang.Object implements net.minecraft.launchwrapper.ITweaker"
package: "net/minecraftforge/fml/common/launcher"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/launcher/FMLTweaker.html"
sourceType: javadoc
---

# FMLTweaker

## Class signature

```java
public class FMLTweaker extends java.lang.Object implements net.minecraft.launchwrapper.ITweaker
```

## Constructors

- `public FMLTweaker()`

## Methods

- `public void acceptOptions(java.util.List<java.lang.String> args, java.io.File gameDir, java.io.File assetsDir, java.lang.String profile)`
- `public void injectIntoClassLoader(net.minecraft.launchwrapper.LaunchClassLoader classLoader)`
- `public java.lang.String getLaunchTarget()`
- `public java.lang.String[] getLaunchArguments()`
- `public java.io.File getGameDir()`
- `public static java.net.URI getJarLocation()`
- `public void injectCascadingTweak(java.lang.String tweakClassName)`
