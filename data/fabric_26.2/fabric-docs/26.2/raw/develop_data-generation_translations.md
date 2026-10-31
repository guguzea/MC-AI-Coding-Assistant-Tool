# Translation Generation

> 来源：https://raw.githubusercontent.com/FabricMC/fabric-docs/238533d819fcb5ec9405acb58fb0ac7655df63b1/develop/data-generation/translations.md
> 版本：26.2
> GitHub 路径：develop/data-generation/translations.md
> 抓取源：github_latest_pinned
> 抓取时间：2026-10-30T17:15:12.606Z
> SHA256：4c8857766f41c7f4a1022daf9194637ae0f48ed89cba0f76c832e876924cef42
> 分支：main@238533d819fcb5ec9405acb58fb0ac7655df63b1

---
title: Translation Generation
description: A guide to setting up translation generation with datagen.
authors:
  - CelDaemon
  - IMB11
  - MattiDragon
  - skycatminepokie
  - Spinoscythe
authors-nogithub:
  - jmanc3
  - mcrafterzz
  - sjk1949
---

<!---->

::: info PREREQUISITES

Make sure you've completed the [datagen setup](./setup) process first.

:::

## Setup {#setup}

First, we'll make our **provider**. Remember, providers are what actually generate data for us. Create a class that extends `FabricLanguageProvider` and fill out the base methods:

<<< @/reference/latest/src/client/java/com/example/docs/datagen/ExampleModEnglishLangProvider.java#datagen_translations_provider

::: tip

You will need a different provider for each language you want to generate (eg. one `ExampleEnglishLangProvider` and one `ExamplePirateLangProvider`).

:::

To finish setup, add this provider to your `DataGeneratorEntrypoint` within the `onInitializeDataGenerator` method.

<<< @/reference/latest/src/client/java/com/example/docs/datagen/ExampleModDataGenerator.java#datagen_translations_register

## Creating Translations {#creating-translations}

Along with creating raw translations, translations from `Identifier`s, and copying them from an already existing file (by passing a `Path`), there are helper methods for translating items, blocks, tags, stats, entities, mob effects, creative tabs, entity attributes, and enchantments. Simply call `add` on the `translationBuilder` with what you want to translate and what it should translate to:

<<< @/reference/latest/src/client/java/com/example/docs/datagen/ExampleModEnglishLangProvider.java#datagen_translations_build

You can also merge in translations from a JSON file that already lives in your mod. Place that file somewhere outside the generated directory, then pass it to `translationBuilder.add`:

<<< @/reference/latest/src/main/resources/assets/example-mod/lang/en_us.existing.json

<<< @/reference/latest/src/client/java/com/example/docs/datagen/ExampleModEnglishLangProvider.java#datagen_translations_existing

## Using Translations {#using-translations}

Generated translations take the place of a lot of translations added in other tutorials, but you can also use them anywhere you use a `Component` object. In our example, if we wanted to allow resource packs to translate our greeting, we use `Component.translatable` instead of `Component.literal`:

```java
ChatComponent chatHud = Minecraft.getInstance().gui.getChat();
chatHud.addMessage(Component.literal("Hello there!")); // [!code --]
chatHud.addMessage(Component.translatable("text.example-mod.greeting")); // [!code ++]
```
