# Tag Generation

> 来源：https://raw.githubusercontent.com/FabricMC/fabric-docs/238533d819fcb5ec9405acb58fb0ac7655df63b1/develop/data-generation/tags.md
> 版本：26.2
> GitHub 路径：develop/data-generation/tags.md
> 抓取源：github_latest_pinned
> 抓取时间：2026-10-30T17:15:12.606Z
> SHA256：5dd16a79defb67575f1721fc2ffafd2035854a36aeb4278fc5d3668a811a6c4a
> 分支：main@238533d819fcb5ec9405acb58fb0ac7655df63b1

---
title: Tag Generation
description: A guide to setting up tag generation with datagen.
authors:
  - cassiancc
  - CelDaemon
  - IMB11
  - skycatminepokie
  - Spinoscythe
authors-nogithub:
  - mcrafterzz
---

<!---->

::: info PREREQUISITES

Make sure you've completed the [datagen setup](./setup) process first.

:::

## Setup {#setup}

Here we'll show how to create `Item` tags, but the same principle applies for other things.

Fabric provides several helper tag providers including one for items; `FabricTagsProvider.ItemTagsProvider`. We will use this helper class for this example.

You can create your own class that extends `FabricTagsProvider<T>`, where `T` is the type of thing you'd like to provide a tag for. This is your **provider**.

Let your IDE fill in the required code, then replace the `resourceKey` constructor parameter with the `ResourceKey` for your type:

<<< @/reference/latest/src/client/java/com/example/docs/datagen/ExampleModItemTagProvider.java#datagen_tags_provider

::: tip

You will need a different provider for each type of tag (eg. one `FabricTagsProvider<EntityType<?>>` and one `FabricTagsProvider<Item>`).

:::

To finish setup, add this provider to your `DataGeneratorEntrypoint` within the `onInitializeDataGenerator` method.

<<< @/reference/latest/src/client/java/com/example/docs/datagen/ExampleModDataGenerator.java#datagen_tags_register

## Creating a Tag {#creating-a-tag}

Now that you've created a provider, let's add a tag to it. First, create a `TagKey<T>`:

<<< @/reference/latest/src/client/java/com/example/docs/datagen/ExampleModItemTagProvider.java#datagen_tags_tag_key

Next, call `builder` inside your provider's `configure` method. From there, you can add individual item IDs, add other tags, or make this tag replace pre-existing tags.

If you want to add a tag, use `addOptionalTag`, as the tag's contents may not be loaded during datagen. If you are certain the tag is loaded, call `addTag`.

To forcefully add a tag and ignore the broken format, use `forceAddTag`.

<<< @/reference/latest/src/client/java/com/example/docs/datagen/ExampleModItemTagProvider.java#datagen_tags_build

## Translating Tags {#translating-tags}

Tags created by your mod should have translations, so that other mods - such as recipe viewers - can properly display the tag's name. If one of your tags is missing a translation, you may see a warning similar to the following in your logs:

> Dev warning - Untranslated Item Tags detected. Please translate your item tags so other mods such as recipe viewers can properly display your tag's name.

We can follow the [Translation Generation guide](./translations) to add a translation for our tag. We can use the same translation builder and pass the `TagKey` and the display name:

<<< @/reference/latest/src/client/java/com/example/docs/datagen/ExampleModEnglishLangProvider.java#tag_name
