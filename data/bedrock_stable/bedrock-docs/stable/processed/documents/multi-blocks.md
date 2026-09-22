> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/multi-blocks?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:50:17.398Z
> 警告：此文档可能滞后于当前正式版

# Create a Multi-Block

A multi-block is a collection of individual blocks that behave as one single block, such as a door or a bed. When you place a multi-block, all its block parts are placed at once. If any block part breaks, then the entire multi-block will break by way of a BlockComponentBlockBreakEvent , note that for scripts only a single event will be sent for the part that was first broken you may access the other parts in scripting with the method Block.getParts . Player and Redstone interactions have the same behavior: any interaction with a single block within the multi-block interacts with all the blocks.

In this tutorial, we'll be examining the four-part light post multi-block from the Minecraft Samples repository .

## Definition

Here's how the light post in the Samples repo is defined.

### The multi-block trait

First, we use a new block trait , `minecraft:multi_block`. This trait gives the block a new state called `minecraft:multi_block_part`; the values of this new state correspond to the individual block parts. `0` indicates the light post's starting block, and `2` indicates the end block.

The multi-block trait has two properties:

- direction indicates which direction to place the parts from start to end in a single axis.

- parts is optional; it specifies how many block parts there are, from 2 to 4 . The default is 2 .

The `direction` property can accept any valid direction . However, for horizontal multi-blocks `north`, `south`, `west`, `east` the direction may be overridden by the player facing direction if the block also defines the minecraft:placement_direction trait that enables the `minecraft:cardinal_direction` state.

Important

The `minecraft:multi_block` trait requires Bedrock Edition 1.26.10 or higher. For vertical directions if the block `format_version` is less than 1.26.40 then it requires that the "Upcoming Creator Features" experimental toggle is set on. For horizontal directions the experiment is required for `format_version` less than 1.26.50.

First, let's define the light post without any components:

```json
{
 "format_version": "1.26.40",
 "minecraft:block": {
 "description": {
 "identifier": "multiblock:light",
 "traits": {
 "minecraft:multi_block": {
 "enabled_states": [
 "minecraft:multi_block_part"
 ],
 "parts": 4,
 "direction": "up"
 }
 }
 },
 "components": {
 }
 }
}
```

### Geometry and visuals

Next, we'll need to add geometry for our four block parts. The light post has three unique geometries:

 Geometry
 Image

 base

 pole

 light

And, the geometries will use one of two textures:

 Texture
 Image

 light_on

 light_off

With these, we can set up the block parts. We'll also add some other components like `collision_box` , to let each block have a unique box for per-block collisions, and `selection_box` to allow cursor selection of the individual blocks in the multi-block. Selecting an individual block will still select the whole multi-block; the boxes are combined together for interaction purposes.

Here's the new block definition. Note that parts 1 and 2 share the same geometry, and part 3 chooses the `on` or `off` texture based on the `multi_block:light_on` state.

```json
{
 "format_version": "1.26.40",
 "minecraft:block": {
 "description": {
 "identifier": "multiblock:light",
 "traits": {
 "minecraft:multi_block": {
 "enabled_states": [
 "minecraft:multi_block_part"
 ],
 "parts": 4,
 "direction": "up"
 }
 },
 "states": {
 "multi_block:light_on": [ false, true ]
 }
 },
 "components": {
 "minecraft:selection_box": {
 "origin": [-2, 0, -8],
 "size": [5, 12, 5]
 },
 "minecraft:geometry": "geometry.light_post_base",
 "minecraft:material_instances": {
 "*": {
 "texture": "light_post_off",
 "render_method": "opaque"
 }
 }
 },
 "permutations": [
 {
 "condition": "q.block_state('minecraft:multi_block_part') == 0",
 "components": {
 "minecraft:collision_box": {
 "origin": [-2, 0, -8],
 "size": [5, 12, 5]
 },
 "minecraft:geometry": "geometry.light_post_base"
 }
 },
 {
 "condition": "q.block_state('minecraft:multi_block_part') == 1 || q.block_state('minecraft:multi_block_part') == 2",
 "components": {
 "minecraft:collision_box": {
 "origin": [-2, 0, -7],
 "size": [5, 16, 3]
 },
 "minecraft:geometry": "geometry.light_post_pole"
 }
 },
 {
 "condition": "q.block_state('minecraft:multi_block_part') == 3 && q.block_state('multi_block:light_on') == false",
 "components": {
 "minecraft:collision_box": {
 "origin": [-2, 14, -7],
 "size": [5, 4, 15]
 },
 "minecraft:geometry": "geometry.light_post_light",
 "minecraft:material_instances": {
 "*": {
 "texture": "light_post_off",
 "render_method": "opaque"
 }
 }
 }
 },
 {
 "condition": "q.block_state('minecraft:multi_block_part') == 3 && q.block_state('multi_block:light_on') == true",
 "components": {
 "minecraft:collision_box": {
 "origin": [-2, 14, -7],
 "size": [5, 4, 15]
 },
 "minecraft:geometry": "geometry.light_post_light",
 "minecraft:material_instances": {
 "*": {
 "texture": "light_post_on",
 "render_method": "opaque"
 }
 }
 }
 }
 ]
 }
}
```

### Combining block traits

The multi-block trait can be combined with other block traits. For the light post, we'll add the `placement_direction` trait, which will allow the light post to rotate depending on the direction the player is facing.

Here's the updated definition file, with some parts elided to save a little space. For each cardinal direction state, we use the `transformation` component to apply a rotation to the block parts.

```json
{
 "format_version": "1.26.40",
 "minecraft:block": {
 "description": {
 "identifier": "multiblock:light",
 "traits": {
 "minecraft:placement_direction": {
 "enabled_states": [
 "minecraft:cardinal_direction"
 ]
 },
 "minecraft:multi_block": {
 "enabled_states": [
 "minecraft:multi_block_part"
 ],
 "parts": 4,
 "direction": "up"
 }
 },
 "states": {
 "multi_block:light_on": [ false, true ]
 }
 },
 "components": {
 ...
 },
 "permutations": [
 ...,
 {
 "condition": "q.block_state('minecraft:cardinal_direction') == 'north'",
 "components": {
 "minecraft:transformation": {
 "rotation": [0,0,0]
 }
 }
 },
 {
 "condition": "q.block_state('minecraft:cardinal_direction') == 'south'",
 "components": {
 "minecraft:transformation": {
 "rotation": [0,180,0]
 }
 }
 },
 {
 "condition": "q.block_state('minecraft:cardinal_direction') == 'west'",
 "components": {
 "minecraft:transformation": {
 "rotation": [0,90,0]
 }
 }
 },
 {
 "condition": "q.block_state('minecraft:cardinal_direction') == 'east'",
 "components": {
 "minecraft:transformation": {
 "rotation": [0,270,0]
 }
 }
 }
 ]
 }
}
```

The four directions of the light post look like this:

## Creating the item

To place the multi-block light post, let's make a custom item with the `block_placer` component, along with the `icon` component to render the item.

```json
{
 "format_version": "1.21.100",
 "minecraft:item": {
 "description": {
 "identifier": "multiblock:light"
 },
 "components": {
 "minecraft:icon": {
 "textures": {
 "default": "light_post_item"
 }
 },
 "minecraft:block_placer": {
 "block": "multiblock:light",
 "replace_block_item": true
 },
 "minecraft:display_name": {
 "value": "light_post"
 },
 "minecraft:max_stack_size": 64
 }
 }
}
```

And, here's what the item looks like:

## Scripts

Light posts need power, so ours can only turn on when Redstone is connected to it. We'll need to do the following:

- Add a redstone_consumer component to the light post.

- Add a custom component , multi_block:light_post_component .

- Define the component in a script which listens for Redstone update events to change the multi_block:light_on state on all block parts.

- Use the minecraft:light_emission component to emit light from the end part.

### Adding the components

At the end of the `components` block in the multi-block definition file, we need to add our two new components. We'll also make the light post destructible while we're at it, to give it a bit more flavor.

```json
"components": {
 // ...
 "minecraft:destructible_by_mining": {
 "seconds_to_destroy": 3
 },
 "minecraft:destructible_by_explosion": {
 "explosion_resistance": 3
 },
 "minecraft:movable": {
 "movement_type": "popped"
 },
 "multi_block:light_post_component": {},
 "minecraft:redstone_consumer": {}
}
```

In the multi-block definition file, the conditions for the end block part need to have the `light_emission` component added. Change the ones for part `3` to read like this:

```json
{
 "condition": "q.block_state('minecraft:multi_block_part') == 3 && q.block_state('multi_block:light_on') == false",
 "components": {
 "minecraft:collision_box": {
 "origin": [-2, 14, -7],
 "size": [5, 4, 15]
 },
 "minecraft:geometry": "geometry.light_post_light",
 "minecraft:material_instances": {
 "*": {
 "texture": "light_post_off",
 "render_method": "opaque"
 }
 },
 "minecraft:light_emission": 0
 }
},
{
 "condition": "q.block_state('minecraft:multi_block_part') == 3 && q.block_state('multi_block:light_on') == true",
 "components": {
 "minecraft:collision_box": {
 "origin": [-2, 14, -7],
 "size": [5, 4, 15]
 },
 "minecraft:geometry": "geometry.light_post_light",
 "minecraft:material_instances": {
 "*": {
 "texture": "light_post_on",
 "render_method": "opaque"
 }
 },
 "minecraft:light_emission": 15
 }
}
```

And, we'll need a script to power our custom component:

```javascript
import { system } from "@minecraft/server";

class LightPostComponent {
 static componentName = "multi_block:light_post_component";

 constructor() {
 this.onRedstoneUpdate = this.onRedstoneUpdate.bind(this);
 }
 checkStateIsGood(state) {
 if (state === undefined) {
 return false; // no state
 }
 else if (typeof state !== 'boolean') {
 return false; // bad state
 }
 return true;
 }

 setLight(block, powerLevel) {
 const perm = block.permutation;
 const lightOnState = perm.getState('multi_block:light_on');
 if (this.checkStateIsGood(lightOnState)) {
 if(powerLevel > 0) {
 block.setPermutation(perm.withState('multi_block:light_on', true));
 }
 else {
 block.setPermutation(perm.withState('multi_block:light_on', false));
 }
 }
 }

 onRedstoneUpdate(event) {
 const parts = event.block.getParts();
 if (parts === undefined) {
 return; // not a multi-block
 }

 parts.forEach((part) => {
 this.setLight(part, event.powerLevel)
 });
 }
}

system.beforeEvents.startup.subscribe((initEvent) => {
 initEvent.blockComponentRegistry.registerCustomComponent(LightPostComponent.componentName, new LightPostComponent());
});
```

Now, our light post will come on when Redstone is connected to it!

## Wrapping up

This walk-through of the light post multi-block should give you a good understanding of how multi-blocks are assembled out of individual block parts, from traits to components to event scripting. And, it should be a good starting point for creating your own multi-blocks!

## Bonus: creating a horizontal multi-block

You can also create a horizontal multi-block, these are multi-blocks that are defined with a direction of either `north`, `south`, `west`, or `east`. Unlike vertical multi-blocks these ones are special because they can cross chunk boundaries. This means that potentially when placing the parts you could have one or more parts of the multi-block in a fully loaded chunk, and one or more parts extending into another chunk that is not fully loaded. In such a scenario the placement will fail and not place any parts at that moment, instead it will cache that placement action in both memory and level storage so that the action is not lost. When both chunks are fully loaded it will execute that placement action and discard it from memory and storage.

The following block definition is an example of a horizontal multi-block log that can be found in the multi-block_sample pack.

```json
{
 "format_version": "1.26.50",
 "minecraft:block": {
 "description": {
 "identifier": "multi_block:horizontal_log",
 "traits": {
 "minecraft:placement_direction": {
 "enabled_states": [
 "minecraft:cardinal_direction"
 ]
 },
 "minecraft:multi_block": {
 "enabled_states": ["minecraft:multi_block_part"],
 "parts": 4,
 "direction": "north"
 }
 }
 },

 "components": {
 "minecraft:geometry": "minecraft:geometry.full_block",
 "minecraft:material_instances": {
 "up": {"texture": "horizontal_log_side"},
 "down": {"texture": "horizontal_log_side"},
 "north": {"texture": "horizontal_log_top"},
 "south": {"texture": "horizontal_log_top"},
 "west": {"texture": "horizontal_log_side"},
 "east": {"texture": "horizontal_log_side"}
 },
 "minecraft:collision_box": true,
 "minecraft:movable": {"movement_type": "immovable"},
 "minecraft:destructible_by_mining": {
 "seconds_to_destroy": 3
 },
 "minecraft:destructible_by_explosion": {
 "explosion_resistance": 3
 }
 },
 "permutations": [
 {
 "condition": "q.block_state('minecraft:cardinal_direction') == 'north'",
 "components": {
 "minecraft:transformation": {
 "rotation": [0,0,0]
 }
 }
 },
 {
 "condition": "q.block_state('minecraft:cardinal_direction') == 'south'",
 "components": {
 "minecraft:transformation": {
 "rotation": [0,180,0]
 }
 }
 },
 {
 "condition": "q.block_state('minecraft:cardinal_direction') == 'west'",
 "components": {
 "minecraft:transformation": {
 "rotation": [0,90,0]
 }
 }
 },
 {
 "condition": "q.block_state('minecraft:cardinal_direction') == 'east'",
 "components": {
 "minecraft:transformation": {
 "rotation": [0,270,0]
 }
 }
 }
 ]
 }
}
```

This definition will give you the horizontal log like this:

Note that you don't actually need to define the permutations for the multi-block to work, the 4 permutations in the definition above are to rotate each individual part so that the textures align properly. Without the defined permutations the log will look like this:

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
