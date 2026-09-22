---
title: "LanguageManager"
description: "public class LanguageManager extends java.lang.Object implements IResourceManagerReloadListener"
package: "net/minecraft/client/resources"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/resources/LanguageManager.html"
sourceType: javadoc
---

# LanguageManager

**Inheritance:** java.lang.Object → net.minecraft.client.resources.LanguageManager

## Class signature

```java
public class LanguageManager extends java.lang.Object implements IResourceManagerReloadListener
```

## Constructors

- `LanguageManager(MetadataSerializer theMetadataSerializerIn, java.lang.String currentLanguageIn)`

## Methods

- `Language getCurrentLanguage()`
- `java.util.SortedSet<Language> getLanguages()`
- `boolean isCurrentLanguageBidirectional()`
- `boolean isCurrentLocaleUnicode()`
- `void onResourceManagerReload(IResourceManager resourceManager)`
- `void parseLanguageMetadata(java.util.List<IResourcePack> resourcesPacks)`
- `void setCurrentLanguage(Language currentLanguageIn)`

## Fields

- `protected static Locale CURRENT_LOCALE`
