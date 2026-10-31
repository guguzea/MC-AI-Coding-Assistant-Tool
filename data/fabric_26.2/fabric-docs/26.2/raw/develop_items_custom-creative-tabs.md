# Custom Creative Tabs

> 来源：https://raw.githubusercontent.com/FabricMC/fabric-docs/238533d819fcb5ec9405acb58fb0ac7655df63b1/develop/items/custom-creative-tabs.md
> 版本：26.2
> GitHub 路径：develop/items/custom-creative-tabs.md
> 抓取源：github_latest_pinned
> 抓取时间：2026-10-30T17:15:12.606Z
> SHA256：f50fb148de165deab0b01f7bc21ddeb8123d84b25323b0d489691076f1dfd89f
> 分支：main@238533d819fcb5ec9405acb58fb0ac7655df63b1

---
title: Custom Creative Tabs
description: Learn how to create your own creative tab and add items to it.
authors:
  - CelDaemon
  - IMB11
---

Creative Tabs, also known as Item Groups, are the tabs in the creative inventory that store items. You can create your own creative tab to store your items in a separate tab. This is pretty useful if your mod adds a lot of items and you want to keep them organized in one location for your players to easily access.

## Creating the Creative Tab {#creating-the-creative-tab}

Adding a creative tab is pretty simple. Simply create a new static final field in your items class to store the creative tab and a resource key for it. You can then use `FabricCreativeModeTab.builder` to create the tab and add items to it:

<<< @/reference/latest/src/main/java/com/example/docs/item/ModItems.java#custom_creative_tab

<<< @/reference/latest/src/main/java/com/example/docs/item/ModItems.java#register_creative_tab

You should see a new tab is now in the creative inventory menu. However, it is untranslated - you must add a translation key to your translations file - similarly to how you translated your first item.

![Creative Tab without translation in creative menu](/assets/develop/items/itemgroups_0.png)

## Adding a Translation Key {#adding-a-translation-key}

If you used `Component.translatable` for the `title` method of the creative tab builder, you will need to add the translation to your language file.

```json
{
  "creativeTab.example-mod": "Example Mod"
}
```

Now, as you can see, the creative tab should be correctly named:

![Fully completed creative tab with translation and items](/assets/develop/items/itemgroups_1.png)
