# Translation Generation

> 来源：https://raw.githubusercontent.com/FabricMC/fabric-docs/main/versions/1.21.11/develop/data-generation/translations.md
> 版本：1.21.11
> GitHub 路径：develop/data-generation/translations.md
> 抓取源：github_raw_versioned
> 抓取时间：2026-08-20T09:50:25.232Z
> SHA256：35a698edfd91a3385db1d2af4f80bc7b33e23aa732254aad895b01585c38cf7d
> 分支：main

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

@[code lang=java transcludeWith=:::datagen-translations:provider](@/reference/1.21.11/src/client/java/com/example/docs/datagen/ExampleModEnglishLangProvider.java)

::: tip

You will need a different provider for each language you want to generate (eg. one `ExampleEnglishLangProvider` and one `ExamplePirateLangProvider`).

:::

To finish setup, add this provider to your `DataGeneratorEntrypoint` within the `onInitializeDataGenerator` method.

@[code lang=java transcludeWith=:::datagen-translations:register](@/reference/1.21.11/src/client/java/com/example/docs/datagen/ExampleModDataGenerator.java)

## Creating Translations {#creating-translations}

Along with creating raw translations, translations from `Identifier`s, and copying them from an already existing file (by passing a `Path`), there are helper methods for translating items, blocks, tags, stats, entities, mob effects, creative tabs, entity attributes, and enchantments. Simply call `add` on the `translationBuilder` with what you want to translate and what it should translate to:

@[code lang=java transcludeWith=:::datagen-translations:build](@/reference/1.21.11/src/client/java/com/example/docs/datagen/ExampleModEnglishLangProvider.java)

## Using Translations {#using-translations}

Generated translations take the place of a lot of translations added in other tutorials, but you can also use them anywhere you use a `Component` object. In our example, if we wanted to allow resource packs to translate our greeting, we use `Component.translatable` instead of `Component.literal`:

```java
ChatComponent chatHud = Minecraft.getInstance().gui.getChat();
chatHud.addMessage(Component.literal("Hello there!")); // [!code --]
chatHud.addMessage(Component.translatable("text.example-mod.greeting")); // [!code ++]
```
