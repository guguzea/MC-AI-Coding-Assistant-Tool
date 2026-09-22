---
title: "IFMLLoadingPlugin"
description: "public interface IFMLLoadingPlugin"
package: "net/minecraftforge/fml/relauncher"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/relauncher/IFMLLoadingPlugin.html"
sourceType: javadoc
---

# IFMLLoadingPlugin

## Class signature

```java
public interface IFMLLoadingPlugin
```

## Methods

- `java.lang.String getAccessTransformerClass()` — Return an optional access transformer class for this coremod.
- `java.lang.String[] getASMTransformerClass()` — Return a list of classes that implements the IClassTransformer interface
- `java.lang.String getModContainerClass()` — Return a class name that implements "ModContainer" for injection into the mod list The "getName" function should return a name that other mods can, if need be, depend on.
- `java.lang.String getSetupClass()` — Return the class name of an implementor of "IFMLCallHook", that will be run, in the main thread, to perform any additional setup this coremod may require.
- `void injectData(java.util.Map<java.lang.String, java.lang.Object> data)` — Inject coremod data into this coremod This data includes: "mcLocation" : the location of the minecraft directory, "coremodList" : the list of coremods "coremodLocation" : the file this coremod loaded from,
