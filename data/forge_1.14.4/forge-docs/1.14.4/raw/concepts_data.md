---
version: "1.14.4"
forgeVersion: "26.0.21"
chapter: "concepts/data"
source: "https://docs.readthedocs.net/en/1.14.x/concepts/data/"
sourceType: mkdocs
---
# Datapacks

In 1.13, Mojang added [datapacks](https://minecraft.gamepedia.com/Data_pack) to the base game. They allow for the modification of the files placed under resources/data. This includes advancements, loot_tables, structures, recipes, tags, and more in the future. Forge, and your mod, are also datapacks. Any user can therefore modify all the recipes, loot tables, and other data of a mod just like with resource packs.

Therefore, there is little sense in having configurable recipes or mob drops. Any user can modify them to any value (even from other mods).

### Dev Environment

In your project, you have a folder &ldquo;resources&rdquo; that has to contain a folder &ldquo;data&rdquo;. This folder will be your datapack. Your mod can have multiple data domains, since you can add or modify already existing datapacks, like vanilla&rsquo;s, forge&rsquo;s, or another mod&rsquo;s.

Additional reading: [Resource Locations](../resources/)

### Overriding Files

To modify a datapack (be it the end user or in dev), you need to know the mod id and the registry name of the item/mob/advancement that you want to override. These can be found after launching the mod (F3+h), but providing it for users in a simpler way can be helpful (using Github will allow users to navigate the datapack you provide with the mod). You can then follow the steps found [here](https://minecraft.gamepedia.com/Tutorials/Creating_a_data_pack) to create any datapack.