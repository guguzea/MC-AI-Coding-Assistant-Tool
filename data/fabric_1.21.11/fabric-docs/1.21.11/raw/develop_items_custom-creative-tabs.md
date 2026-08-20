# Custom Creative Tabs

> 来源：https://raw.githubusercontent.com/FabricMC/fabric-docs/main/versions/1.21.11/develop/items/custom-creative-tabs.md
> 版本：1.21.11
> GitHub 路径：develop/items/custom-creative-tabs.md
> 抓取源：github_raw_versioned
> 抓取时间：2026-08-20T09:50:57.416Z
> SHA256：d086d8d0955e0125f77ffb497402f1aa4dff40fbdc6d01215ecd7e879e3977c6
> 分支：main

---
title: Custom Creative Tabs
description: Learn how to create your own creative tab and add items to it.
authors:
  - CelDaemon
  - IMB11
---

Creative Tabs, also known as Item Groups, are the tabs in the creative inventory that store items. You can create your own creative tab to store your items in a separate tab. This is pretty useful if your mod adds a lot of items and you want to keep them organized in one location for your players to easily access.

## Creating the Creative Tab {#creating-the-creative-tab}

Adding a creative tab is pretty simple. Simply create a new static final field in your items class to store the creative tab and a resource key for it. You can then use `FabricItemGroup.builder` to create the tab and add items to it:

@[code transcludeWith=:::9](@/reference/1.21.11/src/main/java/com/example/docs/item/ModItems.java)

@[code transcludeWith=:::\_12](@/reference/1.21.11/src/main/java/com/example/docs/item/ModItems.java)

You should see a new tab is now in the creative inventory menu. However, it is untranslated - you must add a translation key to your translations file - similarly to how you translated your first item.

![Creative Tab without translation in creative menu](/assets/develop/items/itemgroups_0.png)

## Adding a Translation Key {#adding-a-translation-key}

If you used `Component.translatable` for the `title` method of the creative tab builder, you will need to add the translation to your language file.

```json
{
  "itemGroup.example-mod": "Example Mod"
}
```

Now, as you can see, the creative tab should be correctly named:

![Fully completed creative tab with translation and items](/assets/develop/items/itemgroups_1.png)
