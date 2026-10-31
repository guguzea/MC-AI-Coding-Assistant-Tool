# Custom Compostable

> 来源：https://raw.githubusercontent.com/FabricMC/fabric-docs/238533d819fcb5ec9405acb58fb0ac7655df63b1/develop/items/custom-compostable.md
> 版本：26.2
> GitHub 路径：develop/items/custom-compostable.md
> 抓取源：github_latest_pinned
> 抓取时间：2026-10-30T17:15:12.606Z
> SHA256：80ce8534dd99584dbadbdf1f4c12cf3bf478236684030fc51ef3f7e5bbcb27db
> 分支：main@238533d819fcb5ec9405acb58fb0ac7655df63b1

---
title: Custom Compostable
description: Learn how to create your own compostable items.
authors:
  - NotNightSky
  - its-miroma
---

Compostable items are those that convert to bone meal when they are placed in a composter. Let's see how we can create our own custom compostable.

## Creating the Item {#creating-the-item}

Let's create a compostable item called "Bone Marrow". We start by [creating an item](./first-item) as usual:

<<< @/reference/latest/src/main/java/com/example/docs/item/ModItemIds.java#bone_marrow_resource

<<< @/reference/latest/src/main/java/com/example/docs/item/ModItems.java#bone_marrow

To make it compostable, we will add it to the `CompostableRegistry.INSTANCE` registry from the Fabric Registry API:

<<< @/reference/latest/src/main/java/com/example/docs/item/ModItems.java#compostable_item

As usual, don't forget to add a texture, translation, creative tab, yada yada. Here's an example texture:

<DownloadEntry visualURL="/assets/develop/items/bone_marrow_big.png" downloadURL="/assets/develop/items/bone_marrow.png">Texture</DownloadEntry>

Here's how it looks like when used in the composter:

<VideoPlayer src="/assets/develop/items/using_bone_marrow.webm">Using Bone Marrow as Compostable</VideoPlayer>
