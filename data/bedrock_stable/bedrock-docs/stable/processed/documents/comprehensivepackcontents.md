> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/comprehensivepackcontents?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:49:35.400Z
> 警告：此文档可能滞后于当前正式版

# Comprehensive List of Add-On Pack Contents

Have you ever wondered what files and folders the most comprehensive behavior, resource, and skin packs would contain? If so, this list is for you.

Minecraft Bedrock Edition can only use Add-On pack file contents if the file is the correct type (like .json, .png, .fsb), and if it is stored in a folder with a particular name, and if that folder is in the correct location.

Behavior packs and resource packs can vary wildly depending on what the creator who made them wants to create. It can also be a design choice to group entities or items in separate folders, rather than storing their .json files all together.

For example, if the creator does not want to use functions, then there is no function section and no .mcfunction files. But if they do want to use a function, then this list helps by showing that the function folder goes in the behavior pack, that the folder must be named function (rather than "functions"), and that only .mcfunction files can go in that folder.

Some features need a folder to contain the resources and a related file like sounds.json .

The only required file in either type of pack is manifest.json .

Wherever possible, the sections are linked to related tutorials, overviews, or reference documents.

## Comprehensive Behavior Pack

Here is an introduction to Behavior Packs .

- animation_controllers .json

- .json

- animations .json

- .json

- blocks .json

- cameras presets .json

- entities .json

- .json

- features .json

- feature_rules .json

- [dialogue] .json

- manifest.json

- functions .mcfunction

- tick.json

- item_catalog crafting_item_catalog.json

- items .json

- loot_tables entities .json

- recipes .json

- spawn_rules .json

- structures .mcstructure

- texts languages.json

- en_US.lang

- .lang

- trading .json

- manifest.json (required)

- pack_icon.png

## Comprehensive Resource Pack

Here is an introduction to Resource Packs .

- animation_controllers .json

- animations .json

- attachables .json

- block_culling .json

- entity .json

- .json

- fogs .json

- items .json

- materials .material

- models .geo.json

- particles .json

- render_controllers .json

- default.render_controllers.json

- sounds .ogg

- .fsb

- texts font glyph_*.png

- en_US.lang

- textures .png

- .png

- blocks .png

- terrain_texture.json

- flipbook_textures.json

- ui .png

- .jpg

- .json

- biomes_client.json - deprecated, see client biomes

- blocks.json

- manifest.json (required)

- pack_icon.png

- sounds.json

## Comprehensive Skin Pack

Here is an introduction to skin packs .

- texts languages.json

- en_US.lang

- .png

- geometry.json

- manifest.json (required)

- skins.json

## Common Files

### manifest.json

This is the most important file in the pack. Without it, Minecraft will not know what to do with the rest of the content.
Different packs' manifest files look similar, but there are some very important differences.

Take a look at these examples and notice the `"type: "` line in the `"modules"` section, if there is one.

 behavior_pack/manifest.json

```json
{
 "format_version": 2,
 "header": {
 "description": "Pack description",
 "name": "My Behavior Pack",
 "uuid": " ",
 "version": [1, 0, 0],
 "min_engine_version": [1, 16, 0]
 },
 "modules":
 [
 {
 "description": "Pack description",
 "type": "data",
 "uuid": " ",
 "version": [1, 0, 0]
 }
 ]
}
```

 resource_pack.manifest.json

```json
{
 "format_version": 2,
 "header": {
 "description": "Resource pack description",
 "name": "My Resource Pack",
 "uuid": " ",
 "version": [1, 0, 0],
 "min_engine_version": [1, 16, 0]
 },
 "modules": [
 {
 "description": "Resource pack description",
 "type": "resources",
 "uuid": " ",
 "version": [1, 0, 0]
 }
 ]
}
```

 skin_pack/manifest.json

```json
{
 "header": {
 "name": "pack.name",
 "version": [1, 0, 0],
 "uuid": " "
 },
 "modules": [
 {
 "version": [1, 0, 0],
 "type": "skin_pack",
 "uuid": " "
 }
 ],
 "format_version": 1
}
```

 world_template/manifest.json

```json
{
 "header": {
 "name": "pack.name",
 "description": "pack.description",
 "version": [1, 0, 0],
 "uuid": " "
 },
 "modules": [
 {
 "version": [1, 0, 0],
 "type": "world_template",
 "uuid": " "
 }
 ],
 "format_version": 2
}
```

 dialogue/manifest.json taken from the NPC Dialogue page.

```json
{
 "format_version":"1.17",
 "minecraft:npc_dialogue":{
 "scenes":[
 {
 "scene_tag":"ducky_intro",
 "npc_name":"Ducky",
 "text":"Hello new friend",
 "on_open_commands":[
 "/clear @p"
 ],
 "on_close_commands":[
 "/say Farewell! "
 ],
 "buttons":[
 {
 "name":"Take Gold?",
 "commands":[
 "/give @initiator gold_ingot"
 ]
 },
 {
 "name":"Wish Luck",
 "commands":[
 "/say Good luck!"
 ]
 }
 ]
 }
 ]
 }
}
```

### .../texts/languages.json

This file tells Minecraft what languages your skin pack supports. Only English (en_US.lang) is required. If you want to support other languages you can make other `xx_YY.lang` files and then edit the languages.json file to tell the game you support them.

The following locales/languages are currently supported:

- "en_US"

- "de_DE"

- "ru_RU"

- "zh_CN"

- "fr_FR"

- "it_IT"

- "pt_BR"

- "fr_CA"

- "zh_TW"

- "es_MX"

- "es_ES"

- "pt_PT"

- "en_GB"

- "ko_KR"

- "ja_JP"

- "nl_NL"

- "bg_BG"

- "cs_CZ"

- "da_DK"

- "el_GR"

- "fi_FI"

- "hu_HU"

- "id_ID"

- "nb_NO"

- "pl_PL"

- "sk_SK"

- "sv_SE"

- "tr_TR"

- "uk_UA"

##### Template languages.json

```json
[
 "en_US"
]
```

### Sample Packs

To see examples of typical Resource and Behavior Packs, check out the Minecraft Vanilla Resource Pack and Vanilla Behavior Pack .

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
