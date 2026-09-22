---
title: "ConfigManager"
description: "public class ConfigManager extends java.lang.Object"
package: "net/minecraftforge/common/config"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/config/ConfigManager.html"
sourceType: javadoc
---

# ConfigManager

**Inheritance:** java.lang.Object → net.minecraftforge.common.config.ConfigManager

## Class signature

```java
public class ConfigManager extends java.lang.Object
```

## Constructors

- `ConfigManager()`

## Methods

- `static java.lang.Class<?>[] getModConfigClasses(java.lang.String modid)`
- `static boolean hasConfigForMod(java.lang.String modid)`
- `static void load(java.lang.String modid, Config.Type type)` — Bounces to sync().
- `static void loadData(ASMDataTable data)`
- `static void sync(java.lang.String modid, Config.Type type)` — Synchronizes configuration data between the file on disk, the Configuration object and the annotated mod classes containing the configuration variables.
