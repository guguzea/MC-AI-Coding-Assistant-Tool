---
version: "1.17.1"
forgeVersion: "37.1.2"
chapter: "datagen/intro"
source: "https://docs.readthedocs.net/en/1.17.x/datagen/intro/"
sourceType: mkdocs
---
# Data Generators

Data generators are a way to programmatically generate the assets and data of mods. It allows the definition of the contents of these files in the code and their automatic generation, without worrying about the specifics.

The data generator system is loaded by the main class `net.minecraft.data.Main`. Different command-line arguments can be passed to customize which mods&rsquo; data are gathered, what existing files are considered, etc. The class responsible for data generation is `net.minecraft.data.DataGenerator`.

The default configurations in the MDK `build.gradle` adds the `runData` task for running the data generators.

## Generator Modes

The data generator can be configured to run 4 different data generations, which are configured from the command-line parameters, and can be checked from `GatherDataEvent#include***` methods.

- <li>**Client Assets**<ul> <li>Generates client-only files in `assets`: block/item models, blockstate JSONs, language files, etc.
- <li>**`--client`**, `includeClient()`

<li>**Server Data**- <li>Generates server-only files in `data`: recipes, advancements, tags, etc.
- <li>**`--server`**, `includeServer()`

<li>**Development Tools**- <li>Runs some development tools: converting SNBT to NBT and vice-versa, etc.
- <li>**`--dev`**, `includeDev()`

<li>**Reports**- <li>Dumps all registered blocks, items, commands, etc.
- <li>**`--reports`**, `includeReports()`

## Data Providers

Data providers are the classes that actually define what data will be generated and provided. All data providers implement `DataProvider`. Minecraft has abstract implementations for most assets and data, so modders need only to extend and override the specified method.

The `GatherDataEvent` is fired on the mod event bus when the data generator is being created, and the `DataGenerator` can be obtained from the event. Create and register data providers using `DataGenerator#addProvider`.

### Client Assets

- <li>`net.minecraftforge.common.data.LanguageProvider` - for language strings; override `#addTranslations`
- <li>`ModelProvider<?>` - base class for all model providers<ul> <li>*These classes are under the `net.minecraftforge.client.model.generators` package*
- <li>`ItemModelProvider` - for item models; override `#registerModels`
- <li>`BlockStateProvider` - for blockstates and their block and item models; override `#registerStatesAndModels`
- <li>`BlockModelProvider` - for block models; override `#registerModels`

<li>`net.minecraftforge.common.data.SoundDefinitionsProvider` - for the `sounds.json`

### Server Data

- <li>`net.minecraftforge.common.data.GlobalLootModifierProvider` - for [global loot modifiers](../../items/globallootmodifiers/); override `#start`
- <li>*These classes are under the `net.minecraft.data` package*
- <li>`LootTableProvider` - for loot tables; override `#getTables`
- <li>`RecipeProvider` - for recipes and their unlocking advancements; override `#buildShapelessRecipes`
- <li>`TagsProvider` - for tags; override `#addTags`

> **Note**: Notes An AdvancementProvider class does exist, however it is hardcoded for only the vanilla advancements.