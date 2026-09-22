---
title: "StatCollector"
description: "public class StatCollector extends java.lang.Object"
package: "net/minecraft/util"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/util/StatCollector.html"
sourceType: javadoc
---

# StatCollector

**Inheritance:** java.lang.Object → net.minecraft.util.StatCollector

## Class signature

```java
public class StatCollector extends java.lang.Object
```

## Constructors

- `StatCollector()`

## Methods

- `static boolean canTranslate(java.lang.String key)` — Determines whether or not translateToLocal will find a translation for the given key.
- `static long getLastTranslationUpdateTimeInMilliseconds()` — Gets the time, in milliseconds since epoch, that the translation mapping was last updated
- `static java.lang.String translateToFallback(java.lang.String key)` — Translates a Stat name using the fallback (hardcoded en_US) locale.
- `static java.lang.String translateToLocal(java.lang.String key)` — Translates a Stat name
- `static java.lang.String translateToLocalFormatted(java.lang.String key, java.lang.Object... format)` — Translates a Stat name with format args
