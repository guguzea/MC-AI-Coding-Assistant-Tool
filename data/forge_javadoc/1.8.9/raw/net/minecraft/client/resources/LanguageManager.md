---
title: "LanguageManager"
description: "public class LanguageManager extends java.lang.Object implements IResourceManagerReloadListener"
package: "net/minecraft/client/resources"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/resources/LanguageManager.html"
sourceType: javadoc
---

# LanguageManager

**Inheritance:** java.lang.Object → net.minecraft.client.resources.LanguageManager

## Class signature

```java
public class LanguageManager extends java.lang.Object implements IResourceManagerReloadListener
```

## Constructors

- `LanguageManager(IMetadataSerializer theMetadataSerializerIn, java.lang.String currentLanguageIn)`

## Methods

- `Language getCurrentLanguage()`
- `java.util.SortedSet<Language> getLanguages()`
- `boolean isCurrentLanguageBidirectional()`
- `boolean isCurrentLocaleUnicode()`
- `void onResourceManagerReload(IResourceManager resourceManager)`
- `void parseLanguageMetadata(java.util.List<IResourcePack> p_135043_1_)`
- `void setCurrentLanguage(Language currentLanguageIn)`

## Fields

- `protected static Locale currentLocale`
