# LanguageRegistry

**Inheritance:** java.lang.Object → cpw.mods.fml.common.registry.LanguageRegistry

## Class signature

```java
public class LanguageRegistry extends java.lang.Object
```

## Constructors

- `LanguageRegistry()`

## Methods

- `@Deprecated static void addName(java.lang.Object objectToName, java.lang.String name)`
- `@Deprecated void addNameForObject(java.lang.Object objectToName, java.lang.String lang, java.lang.String name)`
- `@Deprecated void addStringLocalization(java.util.Properties langPackAdditions)`
- `@Deprecated void addStringLocalization(java.util.Properties langPackAdditions, java.lang.String lang)`
- `@Deprecated void addStringLocalization(java.lang.String key, java.lang.String value)`
- `@Deprecated void addStringLocalization(java.lang.String key, java.lang.String lang, java.lang.String value)`
- `java.lang.String getStringLocalization(java.lang.String key)`
- `java.lang.String getStringLocalization(java.lang.String key, java.lang.String lang)`
- `void injectLanguage(java.lang.String language, java.util.HashMap<java.lang.String, java.lang.String> parsedLangFile)`
- `static LanguageRegistry instance()`
- `void loadLanguagesFor(ModContainer container, Side side)`
- `@Deprecated void loadLocalization(java.lang.String localizationFile, java.lang.String lang, boolean isXML)`
- `@Deprecated void loadLocalization(java.net.URL localizationFile, java.lang.String lang, boolean isXML)`
- `@Deprecated void mergeLanguageTable(java.util.Map field_135032_a, java.lang.String lang)`