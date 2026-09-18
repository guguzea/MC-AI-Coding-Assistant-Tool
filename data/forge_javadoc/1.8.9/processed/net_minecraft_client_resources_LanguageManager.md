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