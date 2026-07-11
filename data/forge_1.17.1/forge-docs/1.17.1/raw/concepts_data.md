---
version: "1.17.1"
forgeVersion: "37.1.2"
chapter: "concepts/data"
source: "https://docs.readthedocs.net/en/1.17.x/concepts/data/"
sourceType: mkdocs
---
# Datapacks

In 1.13, Mojang added [datapacks](https://minecraft.gamepedia.com/Data_pack) to the base game. They allow for the modification of the files for logical servers through the `data` directory. This includes advancements, loot_tables, structures, recipes, tags, etc. Forge, and your mod, can also have datapacks. Any user can therefore modify all the recipes, loot tables, and other data defined within this directory.

### Creating a Datapack

Datapacks are stored within the `data` directory within your project&rsquo;s resources. Your mod can have multiple data domains, since you can add or modify already existing datapacks, like vanilla&rsquo;s, forge&rsquo;s, or another mod&rsquo;s. You can then follow the steps found [here](https://minecraft.gamepedia.com/Tutorials/Creating_a_data_pack) to create any datapack.

Additional reading: [Resource Locations](../resources/#ResourceLocation)