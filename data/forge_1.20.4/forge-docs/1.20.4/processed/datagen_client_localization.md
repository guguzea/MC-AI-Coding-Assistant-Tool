# Language Generation

[Language files](../../../concepts/internationalization/) can be generated for a mod by subclassing `LanguageProvider` and implementing `#addTranslations`. Each `LanguageProvider` subclass created represents a separate [locale](https://minecraft.wiki/w/Language#Languages) (`en_us` represents American English, `es_es` represents Spanish, etc.). After implementation, the provider must be [added](../../#data-providers) to the `DataGenerator`.


<!-- key:🟢 role:示例代码 -->

```java
// On the MOD event bus
@SubscribeEvent
public void gatherData(GatherDataEvent event) {
    event.getGenerator().addProvider(
        // Tell generator to run only when client assets are generating
        event.includeClient(),
        // Localizations for American English
        output -> new MyLanguageProvider(output, MOD_ID, "en_us")
    );
}
```

## `LanguageProvider

Each language provider is simple a map of strings where each translation key is mapped to a localized name. A translation key mapping can be added using <code>#add`. Additionally, there are methods which use the translation key of a `Block`, `Item`, `ItemStack`, `Enchantment`, `MobEffect`, and `EntityType`.


<!-- key:🟢 role:示例代码 -->

```
// In LanguageProvider#addTranslations
this.addBlock(EXAMPLE_BLOCK, "Example Block");
this.add("object.examplemod.example_object", "Example Object");
```


<!-- key:🔴 role:新手必读 (Tip) -->

> **Tip**: Tip Localized names which contain alphanumeric values not in American English can be supplied as is. The provider automatically translates the characters into their unicode equivalents to be read by the game. // Encdoded as 'Example with a d\u00EDacritic' this.addItem("example.diacritic", "Example with a díacritic");