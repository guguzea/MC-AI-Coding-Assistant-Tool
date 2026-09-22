> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/managing-villages?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:49:33.543Z
> 警告：此文档可能滞后于当前正式版

# Managing Village Generation

Depending on the kind of Minecraft world you're envisioning, you may want to prevent villages from being generated in specific biomes, or anywhere in the world. In this tutorial, you'll learn how to create a Behavior Pack that prevents villages from spawning.

## Prerequisites

You should be familiar with the following articles:

- Introduction to Behavior Packs

- Introduction to Resource Packs

Important

Since this pack overwrites biomes, creators will need to keep their biome files up to date with the current Minecraft release, so their players get new biome changes with new releases!

## How it works

Village generation is controlled by the `minecraft:village_type` component in biome definition files. By creating a Behavior Pack that overrides the biome definitions and removes this component, Villages will no longer spawn.

Since villages are spawned during world creation, the override needs to happen before world creation starts.

 Element
 Supported?

 World Templates
 Yes

 Dynamic Worlds
 Yes

 Add-Ons
 No

This Behavior Pack won't remove existing villages in previously-generated chunks. If you use it as an add-on in an existing world, it will prevent villages from generating in new chunks, but already explored areas will keep their villages.

## Creating the pack

- Create a new folder called no_villages for the behavior pack.

- Inside the no_villages folder, create a manifest.json file: ```json { "format_version": 2, "header": { "name": "No Villages", "description": "Prevents villages from generating in new worlds.", "uuid": "YOUR-HEADER-UUID-HERE", "version": [1, 0, 0], "min_engine_version": [1, 21, 0] }, "modules": [ { "description": "Removes village generation from all biomes.", "type": "data", "uuid": "YOUR-MODULE-UUID-HERE", "version": [1, 0, 0] } ] } ``` Important Replace YOUR-HEADER-UUID-HERE and YOUR-MODULE-UUID-HERE with two different randomly-generated UUIDs. You can use any UUID generator to do so, but the UUIDs must be unique!

- Create a biomes subfolder inside no_villages .

- For each biome that normally spawns villages, you'll need to provide an overridden copy of its biome file with the minecraft:village_type component removed. Tip You can get copies of the current biome files at https://github.com/Mojang/bedrock-samples/tree/main/behavior_pack/biomes . The 10 biomes that generate villages are: cold_taiga.biome.json

- cold_taiga_hills.biome.json

- desert.biome.json

- ice_plains.biome.json

- meadow.biome.json

- plains.biome.json

- savanna.biome.json

- sunflower_plains.biome.json

- taiga.biome.json

- taiga_hills.biome.json

To override village generation in all these biomes, you'll need to copy all 10 files into your new biomes folder.

- In each *.biome.json file, find the minecraft:village_type block and delete it. Here's an example using the cold_taiga.biome.json file:

```json
{
 "format_version": "1.26.0",
 "minecraft:biome": {
 "description": {
 "identifier": "minecraft:cold_taiga"
 },
 "components": {
 "minecraft:climate": {
 "downfall": 0.4,
 "snow_accumulation": [0.125, 0.5],
 "temperature": -0.5
 },
 "minecraft:overworld_height": {
 "noise_type": "taiga"
 },
 "minecraft:surface_builder": {
 "builder": {
 "type": "minecraft:overworld",
 "sea_floor_depth": 7,
 "sea_floor_material": "minecraft:gravel",
 "foundation_material": "minecraft:stone",
 "mid_material": "minecraft:dirt",
 "top_material": "minecraft:grass_block",
 "sea_material": "minecraft:water"
 }
 },
 "minecraft:overworld_generation_rules": {
 "hills_transformation": "minecraft:cold_taiga_hills",
 "mutate_transformation": "minecraft:cold_taiga_mutated",
 "generate_for_climates": [
 ["frozen", 1]
 ]
 },
 "minecraft:village_type": { // ** DELETE THIS **
 "type": "taiga" // ** DELETE THIS **
 }, // ** DELETE THIS **
 "minecraft:tags": {
 "tags": [
 "animal", "cold", "forest", "monster",
 "overworld", "taiga", "has_structure_trail_ruins",
 "spawns_cold_variant_farm_animals"
 ]
 }
 }
 }
}
```

- Repeat the same process for the other nine biome files.

## Create the Behavior Pack

- Zip up the no_villages folder and rename the resulting archive with an *.mcpack extension (i.e., no_villages.mcpack ).

- Double-click no_villages.mcpack to import it into Minecraft.

Tip

You can also copy the no_villages folder directly to Bedrock Edition's behavior_packs directory:

`%appdata%\Minecraft Bedrock\users\shared\games\com.mojang\behavior_packs`

## Test the Behavior Pack

- Launch Minecraft and select Play -> Create New World -> Create New World .

- Go to the Behavior Packs section.

- Find No Villages in the available packs list and activate it.

- Create the world.

Now, villages won't generate in any biome.

## Going further

- Only the biomes overridden in your Behavior Pack will no longer have villages. If you want to keep villages in some biomes, don't include their *.biome.json file.

- You can change the village type from its default to one of the other allowed values ( default , desert , ice , savanna , or taiga ) to generate a different kind of village in that biome.

- To re-enable villages in a world, just deactivate the behavior pack. This won't add villages to already-created chunks, though!

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
