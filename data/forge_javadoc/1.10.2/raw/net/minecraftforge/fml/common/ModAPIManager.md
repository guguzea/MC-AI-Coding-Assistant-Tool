---
title: "ModAPIManager"
description: "public class ModAPIManager extends java.lang.Object"
package: "net/minecraftforge/fml/common"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/ModAPIManager.html"
sourceType: javadoc
---

# ModAPIManager

## Class signature

```java
public class ModAPIManager extends java.lang.Object
```

## Constructors

- `public ModAPIManager()`

## Methods

- `public void registerDataTableAndParseAPI( ASMDataTable dataTable)`
- `public void manageAPI( ModClassLoader modClassLoader, ModDiscoverer discoverer)`
- `public void injectAPIModContainers(java.util.List< ModContainer > mods, java.util.Map<java.lang.String, ModContainer > nameLookup)`
- `public void cleanupAPIContainers(java.util.List< ModContainer > mods)`
- `public boolean hasAPI(java.lang.String modId)`
- `public java.lang.Iterable<? extends ModContainer > getAPIList()`
