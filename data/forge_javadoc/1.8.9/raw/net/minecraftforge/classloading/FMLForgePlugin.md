---
title: "FMLForgePlugin"
description: "public class FMLForgePlugin extends java.lang.Object implements IFMLLoadingPlugin"
package: "net/minecraftforge/classloading"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/classloading/FMLForgePlugin.html"
sourceType: javadoc
---

# FMLForgePlugin

**Inheritance:** java.lang.Object → net.minecraftforge.classloading.FMLForgePlugin

## Class signature

```java
public class FMLForgePlugin extends java.lang.Object implements IFMLLoadingPlugin
```

## Constructors

- `FMLForgePlugin()`

## Methods

- `java.lang.String getAccessTransformerClass()` — Return an optional access transformer class for this coremod.
- `java.lang.String[] getASMTransformerClass()` — Return a list of classes that implements the IClassTransformer interface
- `java.lang.String getModContainerClass()` — Return a class name that implements "ModContainer" for injection into the mod list The "getName" function should return a name that other mods can, if need be, depend on.
- `java.lang.String getSetupClass()` — Return the class name of an implementor of "IFMLCallHook", that will be run, in the main thread, to perform any additional setup this coremod may require.
- `void injectData(java.util.Map<java.lang.String, java.lang.Object> data)` — Inject coremod data into this coremod This data includes: "mcLocation" : the location of the minecraft directory, "coremodList" : the list of coremods "coremodLocation" : the file this coremod loaded from,

## Fields

- `static java.io.File forgeLocation`
- `static boolean RUNTIME_DEOBF`
