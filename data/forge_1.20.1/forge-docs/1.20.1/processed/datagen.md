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

- **Client Assets**
- Generates client-only files in `assets`: block/item models, blockstate JSONs, language files, etc.
- **`--client`**, `#includeClient`
- **Server Data**
- Generates server-only files in `data`: recipes, advancements, tags, etc.
- **`--server`**, `#includeServer`
- **Development Tools**
- Runs some development tools: converting SNBT to NBT and vice-versa, etc.
- **`--dev`**, `#includeDev`
- **Reports**
- Dumps all registered blocks, items, commands, etc.
- **`--reports`**, `#includeReports`

All of the generators can be included using `--all`.

## Data Providers

Data providers are the classes that actually define what data will be generated and provided. All data providers implement `DataProvider`. Minecraft has abstract implementations for most assets and data, so modders need only to extend and override the specified method.

The `GatherDataEvent` is fired on the mod event bus when the data generator is being created, and the `DataGenerator` can be obtained from the event. Create and register data providers using `DataGenerator#addProvider`.

### Client Assets

- [`net.minecraftforge.common.data.LanguageProvider`](client/localization/) - for [language strings](https://minecraft.wiki/w/Language); implement `#addTranslations`
- [`net.minecraftforge.common.data.SoundDefinitionsProvider`](client/sounds/) - for [`sounds.json`](https://minecraft.wiki/w/Sounds.json); implement `#registerSounds`
- [`net.minecraftforge.client.model.generators.ModelProvider<?>`](client/modelproviders/) - for [models](../resources/client/models/); implement `#registerModels`<ul> <li>[`ItemModelProvider`](client/modelproviders/#itemmodelprovider) - for item models
- [`BlockModelProvider`](client/modelproviders/#blockmodelprovider) - for block models

<li>[`net.minecraftforge.client.model.generators.BlockStateProvider`](client/modelproviders/#block-state-provider) - for blockstate JSONs and their block and item models; implement `#registerStatesAndModels`

### Server Data

**These classes are under the `net.minecraftforge.common.data` package**:

- [`GlobalLootModifierProvider`](server/glm/) - for [global loot modifiers](../resources/server/glm/); implement `#start`
- [`DatapackBuiltinEntriesProvider`](server/datapackregistries/) for datapack registry objects; pass in `RegistrySetBuilder` to the constructor

**These classes are under the `net.minecraft.data` package**:

- [`loot.LootTableProvider`](server/loottables/) - for [loot tables](../resources/server/loottables/); pass in `LootTableProvider$SubProviderEntry`s to the constructor
- [`recipes.RecipeProvider`](server/recipes/) - for [recipes](../resources/server/recipes/) and their unlocking advancements; implement `#buildRecipes`
- [`tags.TagsProvider`](server/tags/) - for [tags](../resources/server/tags/); implement `#addTags`
- [`advancements.AdvancementProvider`](server/advancements/) - for [advancements](../resources/server/advancements/); pass in `AdvancementSubProvider`s to the constructor