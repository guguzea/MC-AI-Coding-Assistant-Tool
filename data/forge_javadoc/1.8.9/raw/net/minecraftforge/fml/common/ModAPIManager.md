---
title: "ModAPIManager"
description: "public class ModAPIManager extends java.lang.Object"
package: "net/minecraftforge/fml/common"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/ModAPIManager.html"
sourceType: javadoc
---

# ModAPIManager

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.ModAPIManager

## Class signature

```java
public class ModAPIManager extends java.lang.Object
```

## Constructors

- `ModAPIManager()`

## Methods

- `void cleanupAPIContainers(java.util.List<ModContainer> mods)`
- `java.lang.Iterable<? extends ModContainer> getAPIList()`
- `boolean hasAPI(java.lang.String modId)`
- `void injectAPIModContainers(java.util.List<ModContainer> mods, java.util.Map<java.lang.String, ModContainer> nameLookup)`
- `void manageAPI(ModClassLoader modClassLoader, ModDiscoverer discoverer)`
- `void registerDataTableAndParseAPI(ASMDataTable dataTable)`

## Fields

- `static ModAPIManager INSTANCE`
