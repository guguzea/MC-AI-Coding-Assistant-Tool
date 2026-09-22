---
title: "StringTranslate"
description: "public class StringTranslate extends java.lang.Object"
package: "net/minecraft/util"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/util/StringTranslate.html"
sourceType: javadoc
---

# StringTranslate

**Inheritance:** java.lang.Object → net.minecraft.util.StringTranslate

## Class signature

```java
public class StringTranslate extends java.lang.Object
```

## Constructors

- `StringTranslate()`

## Methods

- `long getLastUpdateTimeInMilliseconds()` — Gets the time, in milliseconds since epoch, that this instance was last updated
- `static void inject(java.io.InputStream inputstream)`
- `boolean isKeyTranslated(java.lang.String key)` — Returns true if the passed key is in the translation table.
- `static java.util.HashMap<java.lang.String, java.lang.String> parseLangFile(java.io.InputStream inputstream)`
- `static void replaceWith(java.util.Map<java.lang.String, java.lang.String> p_135063_0_)`
- `java.lang.String translateKey(java.lang.String key)` — Translate a key to current language.
- `java.lang.String translateKeyFormat(java.lang.String key, java.lang.Object... format)` — Translate a key to current language applying String.format()
