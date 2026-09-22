> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/entitycomponentsguide?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:49:59.564Z
> 警告：此文档可能滞后于当前正式版

# Entity Components Guide

Entity components are the heart of how you customize mobs in Minecraft: Bedrock Edition. With over 175 different components available, you have incredibly powerful tools to create unique behaviors, interactions, and characteristics for your entities. While many components serve specific purposes for particular mobs, some components provide highly flexible base entity functionality, and are essential for most customization projects.

This guide covers the most important and commonly used entity components, organized by functionality, with practical examples showing how vanilla Minecraft mobs use these components.

## What is an entity component?

In a nutshell, an entity component defines specific characteristics and functionality that can be shared among entities. Combining components allows you to build up complex behaviors for your mobs. Components could allow an entity to find targets in combat or hunting (`nearest_attackable_target`), react to current weather conditions (`environment_sensor`), or jump over obstacles (`jump.static`). Keeping these behaviors modular—that is, defined in separate components—lets you reuse them in different entities, so you're not reinventing (or copying and pasting) the wheel constantly, while giving you the flexibility to mix and match them to provide unique behaviors.

## Core components

This guide isn't a comprehensive reference to all of the over 175 components Minecraft makes available to you, but just touches on some of the ones most commonly used by creators, along with examples of their use. For the entire list, check out the Entity Components List in the reference section.

### AI goal (behavior) components

Behavior, or AI goal, components control how entities act and respond to their environment.

##### minecraft:behavior.random_stroll

Provides basic wandering behavior, essential for making entities feel alive and natural.

```json
"minecraft:behavior.random_stroll": {
 "priority": 8,
 "speed_multiplier": 1.0
}
```

##### minecraft:behavior.look_at_player

This component defines a behavior for looking at the player: how close the entity has to be before taking a look, how long it will look, and so on.

```json
"minecraft:behavior.look_at_player": {
 "priority": 7,
 "target_distance": 6,
 "probability": 0.02,
 "min_look_time": 40,
 "max_look_time": 80
}
```

There are similar behaviors for other targets to look at, such as `look_at_entity` and `look_at_target` .

##### minecraft:behavior.nearest_attackable_target

This component allows entities to find and target potential threats or prey within a specified range.

```json
"minecraft:behavior.nearest_attackable_target": {
 "priority": 2,
 "must_see": true,
 "reselect_targets": true,
 "within_radius": 25.0,
 "entity_types": [

 {
 "filters": {
 "test": "is_family",
 "subject": "other",
 "value": "player"
 },
 "max_dist": 32
 }
 ]
}
```

##### minecraft:behavior.melee_attack

Defines close-range attack behavior. Essential for any entity that needs to engage in melee combat.

```json
"minecraft:behavior.melee_attack": {
 "priority": 3,
 "speed_multiplier": 1.25,
 "track_target": true
}
```

There are multiple attack behavior components you can use, including charge_attack , delayed_attack , ranged_attack , stomp_attack , and swoop_attack . They're all configured similarly, but may have individual properties appropriate to the attack form.

##### minecraft:behavior.follow_owner

This behavior causes entities such as pets to follow their owner. The `minecraft:behavior.follow_parent` gives similar behavior to babies.

```json
"minecraft:behavior.follow_owner": {
 "priority": 6,
 "speed_multiplier": 1.1
}
```

### Sensor components

Sensor components detect changes in the environment and trigger events based on specific conditions, allowing responsive mob behavior.

##### minecraft:entity_sensor

The most versatile sensor component, `entity_sensor` contains multiple subsensors capable of detecting other entities and triggering events based on complex conditions.

```json
"minecraft:entity_sensor": {
 "relative_range": false,
 "subsensors": [
 {
 "range": [
 2,
 2
 ],
 "event_filters": {
 "all_of": [
 {
 "test": "is_riding",
 "subject": "self",
 "operator": "equals",
 "value": true
 },
 {
 "test": "has_component",
 "subject": "self",
 "operator": "equals",
 "value": "minecraft:behavior.look_at_player"
 }
 ]
 },
 "event": "minecraft:on_riding_player"
 }
 ]
}
```

##### minecraft:environment_sensor

The `environment_sensor` component triggers events based on environmental conditions. It has only one property, `triggers`, which is a list of triggers that define conditions with `filters` and an `event` to trigger when the conditions are met. Here's a simple example for a cave spider, which becomes hostile when the environment's lighting is dim.

```json
"minecraft:environment_sensor": {
 "triggers": {
 "filters": {
 "test": "is_brightness",
 "operator": " .

##### minecraft:damage_sensor

This component triggers events when the entity takes damage.

```json
"minecraft:damage_sensor": {
 "triggers": {
 "on_damage": {
 "filters": {
 "any_of": [
 {
 "test": "is_family",
 "subject": "other",
 "value": "mob"
 },
 {
 "test": "is_family",
 "subject": "other",
 "value": "player"
 }
 ]
 },
 "event": "minecraft:threat_detected"
 }
 }
}
```

### Interaction components

These components define how entities interact with players and the world around them.

##### minecraft:interact

The primary component for player-entity interactions. This component has a huge set of properties available that let you define everything from items the entity can give the player (or items the entity might transform into on certain interactions) to sounds, particle effects, and other entities it can spawn. Here's an example interaction component for the Sheepomelon (a watermelon/sheep hybrid from one of the sample starter packs).

```json
"minecraft:interact": {
 "interactions": [
 {
 "cooldown": 2.5,
 "use_item": false,
 "hurt_item": 1,
 "spawn_items": {
 "table": "loot_tables/entities/sheepomelon_shear.json"
 },
 "play_sounds": "shear",
 "interact_text": "action.interact.shear",
 "on_interact": {
 "filters": {
 "all_of": [
 {
 "test": "has_equipment",
 "subject": "other",
 "domain": "hand",
 "value": "shears"
 },
 {
 "test": "is_family",
 "subject": "other",
 "value": "player"
 },
 {
 "test": "has_component",
 "operator": "!=",
 "value": "minecraft:is_baby"
 }
 ]
 },
 "event": "minecraft:on_sheared",
 "target": "self"
 }
 }
 ]
}
```

##### minecraft:rideable

Entities with this component can be ridden by players (and potentially other entities).

```json
"minecraft:rideable": {
 "seat_count": 1,
 "family_types": ["player"],
 "interact_text": "action.interact.mount",
 "seats": [
 {
 "position": [0.0, 0.9, 0.0],
 "lock_rider_rotation": 0
 }
 ]
}
```

There are other components similar to `minecraft:rideable` that give entities interactive attributes, such as `equippable` , `leashable` , `sittable` , `pushable` , `giveable` , and more.

### Movement and navigation components

These components control how entities move through the world.

##### minecraft:movement and minecraft:movement.basic

Entity movement is governed by a collection of components that follow the naming convention of `minecraft:movement. `, where ` ` is a kind of movement ( skipping , jumping , flying , and so on). There are two foundational components:

- minecraft:movement sets the standard movement speed and maximum speed values for an entity.

- minecraft:movement.basic sets the maximum number in degrees that an entity can turn per tick.

```json
"minecraft:movement.basic": {
 "max_turn": 30.0
}
```

##### minecraft:navigation.generic

Handles pathfinding for entities using a variety of movement methods: walking, swimming, flying, climbing, and jumping. For instance, a turtle uses this component:

```json
"minecraft:navigation.generic": {
 "is_amphibious": true,
 "can_path_over_water": false,
 "can_swim": true,
 "can_walk": true,
 "can_sink": false,
 "avoid_damage_blocks": true
}
```

##### minecraft:jump.static

Gives the enttiy the ability to jump.

```json
"minecraft:jump.static": {
 "jump_power": 0.42
}
```

There is also a `jump.dynamic` component, which changes jump properties based on the entity's speed modifier.

### Physical components

These components define the entity's physicality, from type families to health.

##### minecraft:physics

Sets basic physics properties of an entity, chiefly whether it's affected by gravity and whether it can collide with other objects. By default, both of those characteristics are true, but the Ender Dragon has both those properties set to `false`:

```json
"minecraft:physics": {
 "has_gravity": false,
 "has_collision": false
}
```

You'll want this component in nearly all your custom entities to keep the defaults of `true`. Without it, your entity won't stay on the ground!

```json
"minecraft:physics": {}
```

##### minecraft:collision_box

Defines the entity's physical size for collision detection.

```json
"minecraft:collision_box": {
 "width": 0.9,
 "height": 1.4
}
```

##### minecraft:health

Sets the entity's health points and healing properties.

```json
"minecraft:health": {
 "value": 20,
 "max": 20
}
```

##### minecraft:type_family

Families are tags that assign an entity to one or more categories, such as "aquatic," "inanimate," or "zombie." These categories affect how other entities in the Minecraft world react to them.

```json
"minecraft:type_family": {
 "family": [
 "aquatic",
 "axolotl",
 "mob"
 ]
}
```

## Pulling it all together

These are component examples from Vanilla Minecraft.

### Cow

Looking at how Vanilla Minecraft implements a cow shows the power of combining multiple components. Note that for some components like `can_climb` and `jump.static`, there are no properties: simply including the component enables the cow to climb or jump.

```json
"components": {
 "minecraft:is_hidden_when_invisible": {
 },
 "minecraft:type_family": {
 "family": [ "cow", "mob" ]
 },
 "minecraft:breathable": {
 "total_supply": 15,
 "suffocate_time": 0
 },
 "minecraft:navigation.walk": {
 "can_path_over_water": true,
 "avoid_water": true,
 "avoid_damage_blocks": true
 },
 "minecraft:movement.basic": {
 },
 "minecraft:jump.static": {
 },
 "minecraft:can_climb": {
 },
 "minecraft:collision_box": {
 "width": 0.9,
 "height": 1.3
 },
 "minecraft:nameable": {
 },
 "minecraft:health": {
 "value": 10,
 "max": 10
 },
 "minecraft:hurt_on_condition": {
 "damage_conditions": [
 {
 "filters": {
 "test": "in_lava",
 "subject": "self",
 "operator": "==",
 "value": true
 },
 "cause": "lava",
 "damage_per_tick": 4
 }
 ]
 },
 "minecraft:movement": {
 "value": 0.25
 },
 "minecraft:despawn": {
 "despawn_from_distance": {}
 },
 "minecraft:behavior.float": {
 "priority": 0
 },
 "minecraft:behavior.panic": {
 "priority": 1,
 "speed_multiplier": 1.25
 },
 "minecraft:behavior.mount_pathing": {
 "priority": 2,
 "speed_multiplier": 1.5,
 "target_dist": 0.0,
 "track_target": true
 },
 "minecraft:behavior.breed": {
 "priority": 3,
 "speed_multiplier": 1.0
 },
 "minecraft:behavior.tempt": {
 "priority": 4,
 "speed_multiplier": 1.25,
 "items": [
 "wheat"
 ]
 },
 "minecraft:behavior.follow_parent": {
 "priority": 5,
 "speed_multiplier": 1.1
 },
 "minecraft:behavior.random_stroll": {
 "priority": 6,
 "speed_multiplier": 0.8
 },
 "minecraft:behavior.look_at_player": {
 "priority": 7,
 "look_distance": 6.0,
 "probability": 0.02
 },
 "minecraft:behavior.random_look_around": {
 "priority": 9
 },
 "minecraft:leashable": {
 },
 "minecraft:balloonable": {
 },
 "minecraft:physics": {
 },
 "minecraft:pushable": {
 "is_pushable": true,
 "is_pushable_by_piston": true
 },
 "minecraft:conditional_bandwidth_optimization": {
 }
}
```

### Zombie

Here are the behavior components from the zombie, showing how sophisticated a shambling undead creature can be:

```json
"components": {
 "minecraft:behavior.equip_item": {
 "priority": 2
 },
 "minecraft:behavior.melee_box_attack": {
 "can_spread_on_fire": true,
 "priority": 3
 },
 "minecraft:behavior.stomp_turtle_egg": {
 "priority": 4,
 "speed_multiplier": 1,
 "search_range": 10,
 "search_height": 2,
 "goal_radius": 1.14,
 "interval": 20
 },
 "minecraft:behavior.pickup_items": {
 "priority": 6,
 "max_dist": 3,
 "goal_radius": 2,
 "speed_multiplier": 1.0,
 "pickup_based_on_chance": true,
 "can_pickup_any_item": true,
 "excluded_items": [
 "minecraft:glow_ink_sac"
 ]
 },
 "minecraft:behavior.random_stroll": {
 "priority": 7,
 "speed_multiplier": 1
 },
 "minecraft:behavior.look_at_player": {
 "priority": 8,
 "look_distance": 6,
 "probability": 0.02
 },
 "minecraft:behavior.random_look_around": {
 "priority": 9
 },
 "minecraft:behavior.hurt_by_target": {
 "priority": 1,
 "entity_types": [
 {
 "filters": {
 "test": "is_family",
 "subject": "other",
 "operator": "!=",
 "value": "breeze"
 }
 }
 ]
 },
 "minecraft:behavior.nearest_attackable_target": {
 "priority": 2,
 "must_see": true,
 "reselect_targets": true,
 "within_radius": 25.0,
 "must_see_forget_duration": 17.0,
 "entity_types": [
 {
 "filters": {
 "any_of": [
 { "test": "is_family", "subject": "other", "value": "player" },
 { "test": "is_family", "subject": "other", "value": "snowgolem" },
 { "test": "is_family", "subject": "other", "value": "irongolem" }
 ]
 },
 "max_dist": 35
 },
 {
 "filters": {
 "any_of": [
 { "test": "is_family", "subject": "other", "value": "villager" },
 { "test": "is_family", "subject": "other", "value": "wandering_trader" }
 ]
 },
 "max_dist": 35,
 "must_see_forget_duration": false
 },
 {
 "filters": {
 "all_of": [
 { "test": "is_family", "subject": "other", "value": "baby_turtle" },
 { "test": "in_water", "subject": "other", "operator": "!=", "value": true }
 ]
 },
 "max_dist": 35
 }
 ]
 }
}
```

## Component groups

Component groups provide extra components that are enabled when defined events are triggered. Let's go back to the cave spider example for `environment_sensor`; that's actually a component from a component group, one that turns the cave spider hostile when the light is dim. It's matched with another component in that group that reverses the effect. Here are both of those together:

```json
"component_groups": {
 "minecraft:spider_neutral": {
 "minecraft:environment_sensor": {
 "triggers": {
 "filters": {
 "test": "is_brightness",
 "operator": " ",
 "value": 0.49
 },
 "event": "minecraft:become_neutral"
 }
 },
 "minecraft:behavior.nearest_attackable_target": {
 "priority": 2,
 "must_see": true,
 "attack_interval": 5,
 "entity_types": [
 {
 "filters": {
 "any_of": [
 {
 "test": "is_family",
 "subject": "other",
 "value": "player"
 },
 {
 "test": "is_family",
 "subject": "other",
 "value": "snowgolem"
 },
 {
 "test": "is_family",
 "subject": "other",
 "value": "irongolem"
 }
 ]
 },
 "max_dist": 16
 }
 ]
 },
 "minecraft:behavior.leap_at_target": {
 "priority": 4,
 "yd": 0.4,
 "must_be_on_ground": false
 },
 "minecraft:behavior.melee_box_attack": {
 "priority": 3,
 "track_target": true,
 "random_stop_interval": 100
 }
 }
}
```

The `spider_neutral` group uses the `environment_sensor` to trigger the `minecraft:become_hostile` event, which includes this in its definition:

```json
"events": {
 "minecraft:become_hostile": {
 "sequence": [
 {
 "remove": {
 "component_groups": [
 "minecraft:spider_neutral"
 ]
 },
 "add": {
 "component_groups": [
 "minecraft:spider_hostile"
 ]
 }
 },
 // ...
 ]
 }
}
```

When the spider's `become_hostile` event is triggered, the `spider_neutral` component group is removed and the `spider_hostile` component group is added. While we haven't included it here, the `become_neutral` event is the reverse. We've used component groups to make a simple state machine, keeping track of how angry the spider is feeling.

See the section on component groups in the Entity Behavior Introduction for a more detailed look.

## Next steps

This document covers some of the most essential entity components, but there are nearly two hundred in total! To get a feel for others, take a look through the Bedrock Samples repository , as well as other documentation and sample resources here on the Learning Portal. You can find reference documentation for all available components:

- Entity Components List

- Behavior (AI) Components List

There are also other guides for entity components, focusing on specific aspects:

- Entity Behavior Introduction

- Entity Behavior Guide

- Entity Events

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
