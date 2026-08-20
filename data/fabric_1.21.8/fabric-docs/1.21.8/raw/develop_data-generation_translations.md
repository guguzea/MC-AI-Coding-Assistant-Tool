# Translation Generation

> 来源：https://raw.githubusercontent.com/FabricMC/fabric-docs/main/versions/1.21.8/develop/data-generation/translations.md
> 版本：1.21.8
> GitHub 路径：develop/data-generation/translations.md
> 抓取源：github_raw_versioned
> 抓取时间：2026-08-20T09:47:18.374Z
> SHA256：425b3d109cd6981ea71ac3e6ed3f6ce8cff86633a55a650c9b3bd378db402ea6
> 分支：main

---
title: Translation Generation
description: A guide to setting up translation generation with datagen.
authors:
  - IMB11
  - MattiDragon
  - skycatminepokie
  - Spinoscythe
authors-nogithub:
  - jmanc3
  - mcrafterzz
  - sjk1949
---

::: info PREREQUISITES
Make sure you've completed the [datagen setup](./setup) process first.
:::

## Setup {#setup}

First, we'll make our **provider**. Remember, providers are what actually generate data for us. Create a class that `extends FabricLanguageProvider` and fill out the base methods:

@[code lang=java transcludeWith=:::datagen-translations:provider](@/reference/1.21.8/src/client/java/com/example/docs/datagen/FabricDocsReferenceEnglishLangProvider.java)

::: tip
You will need a different provider for each language you want to generate (eg. one `ExampleEnglishLangProvider` and one `ExamplePirateLangProvider`).
:::

To finish setup, add this provider to your `DataGeneratorEntrypoint` within the `onInitializeDataGenerator` method.

@[code lang=java transclude={28-28}](@/reference/1.21.8/src/client/java/com/example/docs/datagen/FabricDocsReferenceDataGenerator.java)

## Creating Translations {#creating-translations}

Along with creating raw translations, translations from `ResourceLocation`s, and copying them from an already existing file (by passing a `Path`), there are helper methods for translating items, blocks, tags, stats, entities, mob effects, creative tabs, entity attributes, and enchantments. Simply call `add` on the `translationBuilder` with what you want to translate and what it should translate to:

@[code lang=java transcludeWith=:::datagen-translations:build](@/reference/1.21.8/src/client/java/com/example/docs/datagen/FabricDocsReferenceEnglishLangProvider.java)

## Using Translations {#using-translations}

Generated translations take the place of a lot of translations added in other tutorials, but you can also use them anywhere you use a `Component` object. In our example, if we wanted to allow resource packs to translate our greeting, we use `Component.translatable` instead of `Component.literal`:

```java
ChatHud chatHud = Minecraft.getInstance().gui.getChat();
chatHud.addMessage(Component.literal("Hello there!")); // [!code --]
chatHud.addMessage(Component.translatable("text.fabric_docs_reference.greeting")); // [!code ++]
```
