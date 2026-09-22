> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/vibrantvisuals/vvresourcepacks?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:50:07.768Z
> 警告：此文档可能滞后于当前正式版

# Vibrant Visuals Resource Packs

Vibrant Visuals use the same rules for Physically Based Rendering (PBR) texture sets that are used for ray tracing (RTX). If you're not familiar with PBR texture sets, read the overview ; there's more detail on creating texture sets in the reference section Introduction to Texture Sets .

The new pipeline supports both Height Map and Normal Map inputs for bump mapping. In addition, you can now set PBR textures for not just blocks but entities, mobs, particles, and items! They follow the same texture set rules as blocks; you just need to add them to the correct folder in your resource pack: textures/entity , textures/particle , or textures/items .

Vibrant Visuals also supports a new texture set property that describes a material's subsurface scattering properties in addition to its metallic, emissive, and roughness (MER) properties. For more details, read about Subsurface Scattering customization, or consult the Texture Sets documentation .

To let Minecraft know your resource pack includes Vibrant Visuals assets, you need to add the `"pbr"` capability to the `capabilities` array of your pack's manifest.json file and make sure the `"min_engine_version"` is set to `1, 21, 120` or higher:

```json
{
 "format_version": 1,
 "header": {
 ...
 "min_engine_version": [1, 21, 120]
 },
 "modules": [
 ...
 ],
 "capabilities": [
 "pbr"
 ]
}
```

Because the assets required for RTX raytracing are a subset of the assets needed for Vibrant Visuals, a pack with the `"raytraced"` capability also activates Vibrant Visuals. However, it's recommended that you use the `"pbr"` string for your Vibrant Visuals packs; Vibrant Visuals is cross-platform, while RTX raytracing is restricted to RTX-only devices.

## Vibrant Visuals JSON files

Texture Sets define the surface properties of individual blocks or entities, but Vibrant Visuals lighting and effects are defined with Keyframe JSON files . The folder structure for a Vibrant Visuals Resource Pack with PBR texture folders and multiple different Vibrant Visuals JSON files looks like this, although the specific files might change depending on your Resource Pack's needs:

The following sections cover what each of these set of files control and what parameters can be adjusted, how to set different values by time of day with keyframing, and how to customize for different biomes.

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
