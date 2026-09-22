---
title: "ModAPIManager"
description: "public class ModAPIManager extends java.lang.Object"
package: "net/minecraftforge/fml/common"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/ModAPIManager.html"
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
