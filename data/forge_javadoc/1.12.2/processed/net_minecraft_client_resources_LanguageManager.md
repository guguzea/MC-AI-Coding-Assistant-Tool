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
- `Language getLanguage(java.lang.String p_191960_1_)`
- `java.util.SortedSet<Language> getLanguages()`
- `boolean isCurrentLanguageBidirectional()`
- `boolean isCurrentLocaleUnicode()`
- `void onResourceManagerReload(IResourceManager resourceManager)`
- `void parseLanguageMetadata(java.util.List<IResourcePack> resourcesPacks)`
- `void setCurrentLanguage(Language currentLanguageIn)`

## Fields

- `protected static Locale CURRENT_LOCALE`