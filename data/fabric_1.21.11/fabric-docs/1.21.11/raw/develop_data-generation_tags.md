# Tag Generation

> 来源：https://raw.githubusercontent.com/FabricMC/fabric-docs/main/versions/1.21.11/develop/data-generation/tags.md
> 版本：1.21.11
> GitHub 路径：develop/data-generation/tags.md
> 抓取源：github_raw_versioned
> 抓取时间：2026-08-20T03:52:46.194Z
> SHA256：8ad3be85a7dfe73dc8279d3171409c7d1822e83283547f5cadd6eac02b768b5b
> 分支：main

---
title: Tag Generation
description: A guide to setting up tag generation with datagen.
authors:
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

Fabric provides several helper tag providers including one for items; `FabricTagProvider.ItemTagProvider`. We will use this helper class for this example.

You can create your own class that extends `FabricTagProvider<T>`, where `T` is the type of thing you'd like to provide a tag for. This is your **provider**.

Let your IDE fill in the required code, then replace the `resourceKey` constructor parameter with the `ResourceKey` for your type:

@[code lang=java transcludeWith=:::datagen-tags:provider](@/reference/1.21.11/src/client/java/com/example/docs/datagen/ExampleModItemTagProvider.java)

::: tip

You will need a different provider for each type of tag (eg. one `FabricTagProvider<EntityType<?>>` and one `FabricTagProvider<Item>`).

:::

To finish setup, add this provider to your `DataGeneratorEntrypoint` within the `onInitializeDataGenerator` method.

@[code lang=java transcludeWith=:::datagen-tags:register](@/reference/1.21.11/src/client/java/com/example/docs/datagen/ExampleModDataGenerator.java)

## Creating a Tag {#creating-a-tag}

Now that you've created a provider, let's add a tag to it. First, create a `TagKey<T>`:

@[code lang=java transcludeWith=:::datagen-tags:tag-key](@/reference/1.21.11/src/client/java/com/example/docs/datagen/ExampleModItemTagProvider.java)

Next, call `valueLookupBuilder` inside your provider's `configure` method. From there, you can add individual items, add other tags, or make this tag replace pre-existing tags.

If you want to add a tag, use `addOptionalTag`, as the tag's contents may not be loaded during datagen. If you are certain the tag is loaded, call `addTag`.

To forcefully add a tag and ignore the broken format, use `forceAddTag`.

@[code lang=java transcludeWith=:::datagen-tags:build](@/reference/1.21.11/src/client/java/com/example/docs/datagen/ExampleModItemTagProvider.java)
