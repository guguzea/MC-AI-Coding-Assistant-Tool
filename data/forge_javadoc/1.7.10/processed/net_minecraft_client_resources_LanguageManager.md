# LanguageManager

**Inheritance:** java.lang.Object → net.minecraft.client.resources.LanguageManager

## Class signature

```java
public class LanguageManager extends java.lang.Object implements IResourceManagerReloadListener
```

## Constructors

- `LanguageManager(IMetadataSerializer p_i1304_1_, java.lang.String p_i1304_2_)`

## Methods

- `Language getCurrentLanguage()`
- `java.util.SortedSet getLanguages()`
- `boolean isCurrentLanguageBidirectional()`
- `boolean isCurrentLocaleUnicode()`
- `void onResourceManagerReload(IResourceManager p_110549_1_)`
- `void parseLanguageMetadata(java.util.List p_135043_1_)`
- `void setCurrentLanguage(Language p_135045_1_)`

## Fields

- `protected static Locale currentLocale`