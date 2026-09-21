---
version: "1.19.4"
forgeVersion: "45.2.0"
chapter: "rendering/modelextensions/rendertypes"
source: "https://docs.minecraftforge.net/en/1.19.x/rendering/modelextensions/rendertypes/"
sourceType: mkdocs
---
# Render Types

Adding the `render_type` entry at the top level of the JSON suggests to the loader what render type the model should use. If not specified, the loader gets to pick the render type(s) used, often falling back to the render types returned by `ItemBlockRenderTypes#getRenderLayers()`.

Custom model loaders may ignore this field entirely.

> **Note**: Note Since 1.19 this is preferred over the deprecated method of setting the applicable render type(s) via ItemBlockRenderTypes#setRenderLayer() for blocks.

Example of a model for a cutout block with the glass texture

```
{
  "render_type": "minecraft:cutout",
  "parent": "block/cube_all",
  "textures": {
    "all": "block/glass"
  }
}
```

## Vanilla Values

The following options with the respective chunk and entity render type are supplied by Forge (`NamedRenderTypeManager#preRegisterVanillaRenderTypes()`):

- <li>`minecraft:solid`<ul> <li>Chunk render type: `RenderType#solid()`
- <li>Entity render type: `ForgeRenderTypes#ITEM_LAYERED_SOLID`
- <li>Used for fully solid blocks (i.e. Stone)

<li>`minecraft:cutout`- <li>Chunk render type: `RenderType#cutout()`
- <li>Entity render type: `ForgeRenderTypes#ITEM_LAYERED_CUTOUT`
- <li>Used for blocks where any given pixel is either fully transparent or fully opaque (i.e. Glass Block)

<li>`minecraft:cutout_mipped`- <li>Chunk render type: `RenderType#cutoutMipped()`
- <li>Entity render type: `ForgeRenderTypes#ITEM_LAYERED_CUTOUT`
- <li>Chunk and entity render type differ due to mipmapping on the entity render type making items look weird
- <li>Used for blocks where any given pixel is either fully transparent or fully opaque and the texture should be scaled down at larger distances ([mipmapping](https://en.wikipedia.org/wiki/Mipmap)) to avoid visual artifacts (i.e. Leaves)

<li>`minecraft:cutout_mipped_all`- <li>Chunk render type: `RenderType#cutoutMipped()`
- <li>Entity render type: `ForgeRenderTypes#ITEM_LAYERED_CUTOUT_MIPPED`
- <li>Used in similar cases as `minecraft:cutout_mipped` when the item representation should also have mipmapping applied

<li>`minecraft:translucent`- <li>Chunk render type: `RenderType#translucent()`
- <li>Entity render type: `ForgeRenderTypes#ITEM_LAYERED_TRANSLUCENT`
- <li>Used for blocks where any given pixel may be partially transparent (i.e. Stained Glass)

<li>`minecraft:tripwire`- <li>Chunk render type: `RenderType#tripwire()`
- <li>Entity render type: `ForgeRenderTypes#ITEM_LAYERED_TRANSLUCENT`
- <li>Chunk and entity render type differ due to the tripwire render type not being feasible as an entity render type
- <li>Used for blocks with the special requirement of being rendered to the weather render target (i.e. Tripwire)

## Custom Values

Custom named render types to be specified in a model can be registered in the `RegisterNamedRenderTypesEvent`. This event is fired on the mod event bus.

A custom named render type consists of two or three components:

- <li>A chunk render type - any of the types in the list returned by `RenderType.chunkBufferLayers()` can be used
- <li>A render type with the `DefaultVertexFormat.NEW_ENTITY` vertex format (&ldquo;entity render type&rdquo;)
- <li>A render type with the `DefaultVertexFormat.NEW_ENTITY` vertex format for use when the *Fabulous!* graphics mode is selected (optional)

The chunk render type is used when a block using this named render type is rendered as part of the chunk geometry. The required entity render type is used when an item using this named render type is rendered in the Fast and Fancy graphics modes (inventory, ground, item frame, etc.). The optional entity render type is used the same way as the required entity render type when the *Fabulous!* graphics mode is selected. This render type is needed in cases where the required entity render type does not work in the *Fabulous!* graphics mode (typically only applies to translucent render types).

```
public static void onRegisterNamedRenderTypes(RegisterNamedRenderTypesEvent event)
{
  event.register("special_cutout", RenderType.cutout(), Sheets.cutoutBlockSheet());
  event.register("special_translucent", RenderType.translucent(), Sheets.translucentCullBlockSheet(), Sheets.translucentItemSheet());
}
```

These can then be addressed in JSON as `<your_mod_id>:special_cutout` and `<your_mod_id>:special_translucent`.