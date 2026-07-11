# Data Generators

Data generators are a way to programmatically generate the assets and data of mods. It allows the definition of the contents of these files in the code and their automatic generation, without worrying about the specifics.

The data generator system is loaded by the main class `net.minecraft.data.Main`. Different command-line arguments can be passed to customize which mods&rsquo; data are gathered, what existing files are considered, etc. The class responsible for data generation is `net.minecraft.data.DataGenerator`.

The default configurations in the MDK `build.gradle` adds the `runData` task for running the data generators.

## Existing Files

All references to textures or other data files not generated for data generation must reference existing files on the system. This is to ensure that all referenced textures are in the correct places, so typos can be found and corrected.

`ExistingFileHelper` is the class responsible for validating the existence of those data files. An instance can be retrieved from `GatherDataEvent#getExistingFileHelper`.

The `--existing <folderpath>` argument allows the specified folder and its subfolders to be used when validating the existence of files. Additionally, the `--existing-mod <modid>` argument allows the resources of a loaded mod to be used for validation. By default, only the vanilla datapack and resources are available to the `ExistingFileHelper`.

## Generator Modes

The data generator can be configured to run 4 different data generations, which are configured from the command-line parameters, and can be checked from `GatherDataEvent#include***` methods.

- <li>**Client Assets**
- <li>Generates client-only files in `assets`: block/item models, blockstate JSONs, language files, etc.
- <li>**`--client`**, `#includeClient`
- <li>**Server Data**
- <li>Generates server-only files in `data`: recipes, advancements, tags, etc.
- <li>**`--server`**, `#includeServer`
- <li>**Development Tools**
- <li>Runs some development tools: converting SNBT to NBT and vice-versa, etc.
- <li>**`--dev`**, `#includeDev`
- <li>**Reports**
- <li>Dumps all registered blocks, items, commands, etc.
- <li>**`--reports`**, `#includeReports`

All of the generators can be included using `--all`.

## Data Providers

Data providers are the classes that actually define what data will be generated and provided. All data providers implement `DataProvider`. Minecraft has abstract implementations for most assets and data, so modders need only to extend and override the specified method.

The `GatherDataEvent` is fired on the mod event bus when the data generator is being created, and the `DataGenerator` can be obtained from the event. Create and register data providers using `DataGenerator#addProvider`.

### Client Assets

- <li>[`net.minecraftforge.common.data.LanguageProvider`](client/localization/) - for [language strings](https://minecraft.wiki/w/Language); override `#addTranslations`
- <li>[`net.minecraftforge.common.data.SoundDefinitionsProvider`](client/sounds/) - for [`sounds.json`](https://minecraft.wiki/w/Sounds.json); override `#registerSounds`
- <li>[`net.minecraftforge.client.model.generators.ModelProvider<?>`](client/modelproviders/) - for [models](../resources/client/models/); override `#registerModels`<ul> <li>[`ItemModelProvider`](client/modelproviders/#itemmodelprovider) - for item models
- <li>[`BlockModelProvider`](client/modelproviders/#blockmodelprovider) - for block models

<li>[`net.minecraftforge.client.model.generators.BlockStateProvider`](client/modelproviders/#block-state-provider) - for blockstate JSONs and their block and item models; override `#registerStatesAndModels`

### Server Data

- <li>[`net.minecraftforge.common.data.GlobalLootModifierProvider`](server/glm/) - for [global loot modifiers](../resources/server/glm/); override `#start`
- <li>_*These classes are under the `net.minecraft.data` package*_
- <li>[`LootTableProvider`](server/loottables/) - for [loot tables](../resources/server/loottables/); override `#getTables`
- <li>[`RecipeProvider`](server/recipes/) - for [recipes](../resources/server/recipes/) and their unlocking advancements; override `#buildCraftingRecipes`
- <li>[`TagsProvider`](server/tags/) - for [tags](../resources/server/tags/); override `#addTags`
- <li>[`AdvancementProvider`](server/advancements/) - for [advancements](../resources/server/advancements/); override `#registerAdvancements`