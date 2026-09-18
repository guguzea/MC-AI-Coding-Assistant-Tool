---
title: "LanguageManager"
description: "public class LanguageManager extends java.lang.Object implements IResourceManagerReloadListener"
package: "net/minecraft/client/resources"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/resources/LanguageManager.html"
sourceType: javadoc
---

# LanguageManager

## Class signature

```java
public class LanguageManager extends java.lang.Object implements IResourceManagerReloadListener
```

## Constructors

- `public LanguageManager( IMetadataSerializer theMetadataSerializerIn, java.lang.String currentLanguageIn)`

## Methods

- `public void parseLanguageMetadata(java.util.List< IResourcePack > p_135043_1_)`
- `public void onResourceManagerReload( IResourceManager resourceManager)`
- `public boolean isCurrentLocaleUnicode()`
- `public boolean isCurrentLanguageBidirectional()`
- `public void setCurrentLanguage( Language currentLanguageIn)`
- `public Language getCurrentLanguage()`
- `public java.util.SortedSet< Language > getLanguages()`
