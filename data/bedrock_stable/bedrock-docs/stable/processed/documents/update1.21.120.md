> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/update1.21.120?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:49:17.593Z
> 警告：此文档可能滞后于当前正式版

# Minecraft Bedrock 1.21.120 Update Notes for Creators

 Video version of this article from the Minecraft Creator Channel

Minecraft Bedrock been updated to 1.21.120 and there are a number of changes of note for creators. The following features do not require experimental toggles.

## Minecraft Bedrock Platform Path Updates on Windows (GDK)

Important

In this release, the location where Minecraft is stored on Windows devices is changing, and this will impact how you create and edit items within Minecraft Bedrock Edition if you use the Windows platform. See this article for more information on the updated paths.

## Editor

 Editor v1.15
Editor has been updated with a number of features.

- Jigsaw support - Making it easier to work with jigsaws without having to touch JSON!

- Curves in the Line Tool

- Scaling Tool

- Structure Thumbnails

 Get started with Editor!

## Blocks

- Textures + variation - Randomization of textures on a block, per instance. (e.g. a single flower block that gets placed with a random visual rendering).

- Light level API - Allows for reading of light level at any block position (check if sapling has enough light to grow). getLightLevel

- getSkyLightLevel

- flower_pottable - Allows custom blocks to be placed in flowerpots, like custom flowers or saplings. flower_pottable - If present, the associated block can be placed in a flower pot.

- embedded_visual - Defines the visual to use when a block is embedded in another block (e.g, a flower in a flower pot)

- Redstone output - Allows custom blocks to generate redstone power, like a custom redstone block or redstone torch. redstone_producer - Defines how much redstone power the block can produce.

## World Gen

Custom Biomes are now available!

- Jigsaw Structures - The data-driven Jigsaw tech supports custom structures that are connected and generate based on custom rules. This is available in JSON, Scripting API, and via /place jigsaw command. For more on how to use this feature: Introduction to Jigsaw Structures

- Working with Jigsaw Structures

## Items

- swing_duration - defines the duration, in seconds, of the item's swing animation when mining or attacking

## Molang

- Added 21 new Molang expressions for easing and lerping: math.inverse_lerp(start, end, value) - returns the normalized progress between start and end given value

- math.ease_in_quad(start, end, 0_to_1) - output goes from start to end via 0_to_1, starting slow and accelerating toward the end

- math.ease_out_quad(start, end, 0_to_1) - output goes from start to end via 0_to_1, starting fast and decelerating toward the end

- math.ease_in_out_quad(start, end, 0_to_1) - output goes from start to end via 0_to_1, starting slow, accelerating in the middle, then slowing again at the end

- math.ease_in_cubic(start, end, 0_to_1) - output goes from start to end via 0_to_1, starting slow and accelerating strongly toward the end

- math.ease_out_cubic(start, end, 0_to_1) - output goes from start to end via 0_to_1, starting fast and decelerating strongly toward the end

- math.ease_in_out_cubic(start, end, 0_to_1) - output goes from start to end via 0_to_1, starting slow, accelerating strongly in the middle, then slowing again at the end

- math.ease_in_quart(start, end, 0_to_1) - output goes from start to end via 0_to_1, starting slow and accelerating rapidly toward the end

- math.ease_out_quart(start, end, 0_to_1) - output goes from start to end via 0_to_1, starting fast and decelerating rapidly toward the end

- math.ease_in_out_quart(start, end, 0_to_1) - output goes from start to end via 0_to_1, starting slow, accelerating rapidly in the middle, then slowing again at the end

- math.ease_in_quint(start, end, 0_to_1) - output goes from start to end via 0_to_1, starting slow and accelerating sharply toward the end

- math.ease_out_quint(start, end, 0_to_1) - output goes from start to end via 0_to_1, starting fast and decelerating sharply toward the end

- math.ease_in_out_quint(start, end, 0_to_1) - output goes from start to end via 0_to_1, starting slow, accelerating sharply in the middle, then slowing again at the end

- math.ease_in_sine(start, end, 0_to_1) - output goes from start to end via 0_to_1, starting slow and accelerating smoothly toward the end

- math.ease_out_sine(start, end, 0_to_1) - output goes from start to end via 0_to_1, starting fast and decelerating smoothly toward the end

- math.ease_in_out_sine(start, end, 0_to_1) - output goes from start to end via 0_to_1, starting and ending slow, with smoother change in the middle

- math.ease_in_expo(start, end, 0_to_1) - output goes from start to end via 0_to_1, starting slow and accelerating very rapidly toward the end

- math.ease_out_expo(start, end, 0_to_1) - output goes from start to end via 0_to_1, starting fast and decelerating gradually toward the end

- math.ease_in_out_expo(start, end, 0_to_1) - output goes from start to end via 0_to_1, starting and ending slow, with very rapid change in the middle

- math.ease_in_circ(start, end, 0_to_1) - output goes from start to end via 0_to_1, starting slow and accelerating along a circular curve toward the end

- math.ease_out_circ(start, end, 0_to_1) - output goes from start to end via 0_to_1, starting fast and decelerating along a circular curve toward the end

- math.ease_in_out_circ(start, end, 0_to_1) - output goes from start to end via 0_to_1, starting and ending slow, with circular acceleration and deceleration in the middle

- math.ease_in_bounce(start, end, 0_to_1) - output goes from start to end via 0_to_1, starting with bounce oscillations and settling into the end

- math.ease_out_bounce(start, end, 0_to_1) - output goes from start to end via 0_to_1, approaching the end with bounce oscillations that diminish over time

- math.ease_in_out_bounce(start, end, 0_to_1) - output goes from start to end via 0_to_1, starting and ending with bounce oscillations, smoother in the middle

- math.ease_in_back(start, end, 0_to_1) - output goes from start to end via 0_to_1, overshooting backward before accelerating into the end

- math.ease_out_back(start, end, 0_to_1) - output goes from start to end via 0_to_1, overshooting past the end before settling into it

- math.ease_in_out_back(start, end, 0_to_1) - output goes from start to end via 0_to_1, overshooting at both start and end, with smoother change in the middle

- math.ease_in_elastic(start, end, 0_to_1) - output goes from start to end via 0_to_1, starting with elastic oscillations before accelerating into the end

- math.ease_out_elastic(start, end, 0_to_1) - output goes from start to end via 0_to_1, overshooting the end with elastic oscillations before settling

- math.ease_in_out_elastic(start, end, 0_to_1) - output goes from start to end via 0_to_1, oscillating elastically at both start and end, with stable change in the middle

- Swing Queries query.base_swing_duration - returns the duration of the mob's swing/attack animation.

- query.modified_swing_duration - returns the duration of the mob's swing/attack animation.

## Scripting

Biome APIs:

- BiomeType

- Dimension getBiome Spawn Entity with Rotation

- SpawnEntityOptions initialRotation

- initialPersistence Light Level APIs

- Dimension getLightLevel

- getSkyLightlevel

- Block getLightLevel

- getSkyLightLevel Set Dynamic Properties

- Entity setDynamicProperties

- ContainerSlot setDynamicProperties

- ItemStack setDynamicProperties

- World setDyanmicProperties ChunkLoaded APIs

- Dimension isChunkLoaded Container Rules

- ContainerRulesErrorReason

- ContainerRules

- ContainerRulesError

- Container ContainerRules Item Inventory

- ItemInventoryComponent

## What's Next

Looking ahead, here's what you can expect coming in future releases.

### What's Next for Blocks

- Block mask tinting - Allows to tint part of a texture (e.g. grass block is tinted differently for snow on sides and top).

- On environment destroy API - Allows for creators to know that a block was destroyed by something other than the player (needed for logs on a tree to tell leaves they should start to decay).

- Redstone input - Allows custom blocks to apply logic in script when the redstone powered status on the block changes.

- Snow tinting - Allows leaves to change to snow tinted textures over time.

- Leashable - Allows mobs to be leashed to a custom block, like fences. On neighbor change - Allows for a custom block to understand when the block connected to one of their sides changes.

- Block precipitation - Controls when snow falls through a block (flowers) or builds (dirt) also controls rain falling through (flowers).

- Block opacity - Allows creators to define if light can pass through a block from a gameplay perspective. Allowing for scenarios like grass to not turn to dirt when a custom block is on top of it.

### What's Next for Camera

- Splines - Allows for spline movements of the camera.

For more information on what's next, follow our Beta/Preview Changelogs .

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
