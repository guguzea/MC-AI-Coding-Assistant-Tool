# LanguageManager

## Class signature

```java
public class LanguageManager extends java.lang.Object implements IResourceManagerReloadListener
```

## Constructors

- `public LanguageManager( MetadataSerializer theMetadataSerializerIn, java.lang.String currentLanguageIn)`

## Methods

- `public void parseLanguageMetadata(java.util.List< IResourcePack > resourcesPacks)`
- `public void onResourceManagerReload( IResourceManager resourceManager)`
- `public boolean isCurrentLocaleUnicode()`
- `public boolean isCurrentLanguageBidirectional()`
- `public void setCurrentLanguage( Language currentLanguageIn)`
- `public Language getCurrentLanguage()`
- `public java.util.SortedSet< Language > getLanguages()`