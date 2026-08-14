> 来源：https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/componentlist?view=minecraft-bedrock-stable
> 抓取时间：2026-08-14T18:35:24.605Z
> 警告：此文档可能滞后于当前正式版

Entity Components Documentation - Entity Components | Microsoft Learn
			Skip to main content
			Skip to Ask Learn chat experience
					 This browser is no longer supported.
						Upgrade to Microsoft Edge to take advantage of the latest features, security updates, and technical support.
							Download Microsoft Edge
							More info about Internet Explorer and Microsoft Edge
				  Table of contents
				 Exit editor mode
			 Ask Learn
			 Ask Learn
			 Reading mode
			 Table of contents
			 Read in English
			 Add
			 Add to Plans
			 Edit
					 Copy Markdown
					 Print
						 Note
						Access to this page requires authorization. You can try  signing in  or  changing directories .
						Access to this page requires authorization. You can try  changing directories .
					  Entity Components Documentation
			 Feedback
						Summarize this article for me
				In this article
 Entity Components
 Description
  minecraft:addrider
 Adds a rider to the entity.
  minecraft:admire_item
 Allows an entity to ignore attackable targets for a given duration
  minecraft:ageable
 Adds a timer for the entity to grow up.
  minecraft:ambient_sound_interval
 Delay for an entity playing its sound
  minecraft:anger_level
 Compels the entity to track anger towards a set of nuisances.
  minecraft:angry
 Defines an entity's 'angry' state using a timer.
  minecraft:annotation.break_door
 Allows an entity to break doors, assuming that that flags set up for the component to use in navigation.
  minecraft:annotation.open_door
 Allows the entity to open doors.
  minecraft:apply_knockback_rules
 Defines how an entity applies knockback.
  minecraft:apply_knockback_rules_instance
 Intance of rules definition.
  minecraft:area_attack
 A component that does damage to entities that get within range.
  minecraft:attack
 Defines an entity's melee attack damage and any additional status effects applied on hit.
  minecraft:attack_cooldown
 Adds a cooldown to an entity.
  Attack Damage
 Specifies how much damage is dealt by the entity when it attacks.
  Balloonable
 Allows this entity to have a balloon attached and defines the conditions and events for this entity when is ballooned.
  minecraft:barter
 Enables the component to drop an item as a barter exchange.
  minecraft:block_climber
 Allows the player to detect and manuever on the scaffolding block.
  minecraft:block_sensor
 Fires off a specified event when a block in the block list is broken within the sensor range.
  minecraft:body_rotation_always_follows_head
 Causes the entity's body rotation to match the one of their head. Does not override the "minecraft:body_rotation_blocked" component.
  minecraft:body_rotation_axis_aligned
 Causes the entity's body to automatically rotate to align with the nearest cardinal direction based on its current facing direction. Combining this with the "minecraft:body_rotation_blocked" component will cause the entity to align to the nearest cardinal direction and remain fixed in that orientation, regardless of future changes in its facing direction.
  minecraft:body_rotation_blocked
 When set, the entity will no longer visually rotate their body to match their facing direction.
  minecraft:body_rotation_locked_to_vehicle
 Causes the entity's body rotation to match their vehicle's facing direction.
  minecraft:boostable
 Defines the conditions and behavior of a rideable entity's boost.
  minecraft:boss
 Defines the current state of the boss for updating the boss HUD.
  minecraft:break_blocks
 Specifies the blocks that the entity can break as it moves around.
  minecraft:breathable
 Defines what blocks this entity can breathe in and gives them the ability to suffocate.
  minecraft:breedable
 Allows an entity to establish a way to get into the love state used for breeding.
  minecraft:bribeable
 Defines the way an entity can get into the 'bribed' state.
  minecraft:buoyant
 Enables an entity to float on the specified liquid blocks.
  minecraft:burns_in_daylight
 Specifies that this entity takes fire damage when exposed to direct sunlight.
  minecraft:cannot_be_attacked
 When set, blocks entities from attacking the owner entity unless they have the "minecraft:ignore_cannot_be_attacked" component.
  minecraft:can_climb
 Allows an entity to climb ladders.
  minecraft:can_fly
 Marks the entity as being able to fly, the pathfinder won't be restricted to paths where a solid block is required underneath it.
  minecraft:can_join_raid
 Specifies if an entity can join a raid.
  minecraft:can_power_jump
 Allows the entity to power jump like the Horse does in Vanilla.
  minecraft:celebrate_hunt
 Specifies hunt celebration behaviour.
  minecraft:collision_box
 Sets the width and height of the Entity's collision box.
  minecraft:color
 Defines the entity's main color.
  minecraft:color2
 Defines the entity's second texture color.
  minecraft:combat_regeneration
 Gives  Regeneration I  and removes  Mining Fatigue  from the mob that kills the entity's attack target.
  minecraft:conditional_bandwidth_optimization
 Defines the Conditional Spatial Update Bandwidth Optimizations of this entity.
  minecraft:custom_hit_test
 List of hitboxes for melee and ranged hits against the entity.
  minecraft:damage_over_time
 Applies defined amount of damage to the entity at specified intervals.
  minecraft:damage_sensor
 Defines what events to call when this entity is damaged by specific entities or items.
  minecraft:dash
 Ability for a rideable entity to dash.
  minecraft:dash_action
 Ability for a rideable entity to dash.
  minecraft:default_look_angle
 Sets this entity's default head rotation angle.
  minecraft:despawn
 Despawns the Actor when the despawn rules or optional filters evaluate to true.
  minecraft:dimension_bound
 Prevents the entity from changing dimension through portals.
  minecraft:drying_out_timer
 Adds a timer for drying out that will count down and fire 'dried_out_event' or will stop as soon as the entity will get under rain or water and fire 'stopped_drying_out_event'
  minecraft:dweller
 Compels an entity to join and migrate between villages and other dwellings.
  minecraft:economy_trade_table
 Defines this entity's ability to trade with players.
  minecraft:entity_armor_equipment_slot_mapping
 It defines to which armor slot an item equipped to 'minecraft:equippable''s second slot should be equipped to.
  minecraft:entity_sensor
 A component that owns multiple subsensors, each one firing an event when a set of conditions are met by other entities within the defined range.
  minecraft:environment_sensor
 Creates a trigger based on environment conditions.
  minecraft:equipment
 Sets the Equipment table to use for this Entity.
  minecraft:equippable
 Defines an entity's behavior for having items equipped to it.
  minecraft:equip_item
 The entity puts on the desired equipment.
  minecraft:exhaustion_values
 Defines how much exhaustion each player action should take.
  minecraft:experience_reward
 .
  minecraft:explode
 Defines how the entity explodes.
  minecraft:fire_immune
 Sets that this entity doesn't take damage from fire.
  minecraft:floats_in_liquid
 Sets that this entity can float in liquid blocks.
  minecraft:flocking
 Allows entities to flock in groups in water or not.
  minecraft:flying_speed
 Speed in Blocks that this entity flies at.
  minecraft:follow_range
 Defines the maximum range, in blocks, that a mob will pursue a target.
  minecraft:free_camera_controlled
 When configured as a rideable entity, the entity will be controlled using WASD controls and mouse to move in three dimensions.
  minecraft:friction_modifier
 Defines how much friction affects this entity.
  minecraft:game_event_movement_tracking
 Allows an entity to emit  entityMove ,  swim  and  flap  game events, depending on the block the entity is moving through.
  minecraft:genetics
 Defines the way a mob's genes and alleles are passed on to its offspring, and how those traits manifest in the child.
  minecraft:giveable
 Defines sets of items that can be used to trigger events when used on this entity.
  minecraft:ground_offset
 Sets the offset from the ground that the entity is actually at.
  minecraft:group_size
 Keeps track of entity group size in the given radius.
  minecraft:grows_crop
 Could increase crop growth when entity walks over crop
  minecraft:healable
 How entities heal
  Health
 Defines the health pool for an entity, measured in health points (1 point = half a heart).
  minecraft:heartbeat
 Defines the entity's heartbeat.
  minecraft:hide
 Moves to and hides at their owned POI or the closest nearby.
  minecraft:home
 Saves a home position for when the entity is spawned.
  minecraft:horse.jump_strength
 Determines the jump height for a horse or similar entity, like a donkey.
  minecraft:hurt_on_condition
 Defines a set of conditions under which an entity should take damage.
  minecraft:ignore_cannot_be_attacked
 When set, blocks entities from attacking the owner entity unless they have the "minecraft:ignore_cannot_be_attacked" component.
  minecraft:input_air_controlled
 When configured as a rideable entity, the entity will be controlled using WASD controls and mouse to move in three dimensions.
  minecraft:input_ground_controlled
 When configured as a rideable entity, the entity will be controlled using WASD controls.
  minecraft:inside_block_notifier
 Verifies whether the entity is inside any of the listed blocks.
  minecraft:insomnia
 Adds a timer since last rested to see if phantoms should spawn.
  minecraft:instant_despawn
 Despawns the Actor immediately.
  minecraft:interact
 Defines interactions with this entity.
  minecraft:inventory
 Defines this entity's inventory properties.
  minecraft:is_baby
 Sets that this entity is a baby.
  minecraft:is_charged
 Sets that this entity is charged.
  minecraft:is_chested
 Sets that this entity is currently carrying a chest.
  minecraft:is_collidable
 Allows other mobs to have vertical and horizontal collisions with this mob.
  minecraft:is_dyeable
 Allows dyes to be used on this entity to change its color.
  minecraft:is_hidden_when_invisible
 The entity can hide from hostile mobs while invisible.
  minecraft:is_ignited
 Sets that this entity is currently on fire.
  minecraft:is_illager_captain
 Sets that this entity is an Illager Captain.
  minecraft:is_pregnant
 Sets that this entity is currently pregnant.
  minecraft:is_saddled
 Sets that this entity is currently saddled.
  minecraft:is_shaking
 Sets that this entity is currently shaking.
  minecraft:is_sheared
 Sets that this entity is currently sheared.
  minecraft:is_stackable
 Allows instances of this entity to have vertical and horizontal collisions with each other.
  minecraft:is_stunned
 Sets that this entity is currently stunned.
  minecraft:is_tamed
 Sets that this entity is currently tamed.
  minecraft:item_controllable
 Defines what items can be used to control this entity while ridden.
  minecraft:item_hopper
 Determines that this entity is an item hopper.
  minecraft:jump.dynamic
 Defines a dynamic type jump control that will change jump properties based on the speed modifier of the mob.Requires  minecraft:movement.skip  to be used.
  minecraft:jump.static
 Gives the entity the ability to jump.
  minecraft:knockback_resistance
 Determines an entity's resistance to knockback from melee attacks.
  minecraft:lava_movement
 Allows a custom movement speed across lava blocks.
  minecraft:leashable
 Describes how this mob can be leashed to other items
  minecraft:leashable_to
 Allows players to leash entities to this entity, retrieve entities already leashed to it, or free them using shears.
  minecraft:looked_at
 Defines the behavior when another entity looks at the owner entity.
  minecraft:loot
 Specifies the loot table that determines what items this entity drops upon death.
  minecraft:managed_wandering_trader
 Manages the entity's ability to trade.
  minecraft:mark_variant
 Mark Variant is typically used as an additional per-type way (besides  variant ) to express a different visual form of the same mob.
  minecraft:mob_effect
 A component that applies a mob effect to entities that get within range.
  minecraft:mob_effect_immunity
 Entities with this component will have an immunity to the provided mob effects.
  minecraft:movement
 Defines the base movement speed of an entity.
  minecraft:movement.amphibious
 This move control allows the mob to swim in water and walk on land.
  minecraft:movement.basic
 This component accents the movement of an entity.
  Dolphin Movement
 This component can control how dolphins move, in a dolphin-esque style.
  minecraft:movement.fly
 This move control causes the mob to fly.
  minecraft:movement.generic
 This move control allows a mob to fly, swim, climb, etc.
  Glide Movement
 This move control causes the mob to glide.
  minecraft:movement.hover
 This move control causes the mob to hover.
  minecraft:movement.jump
 Move control that causes the mob to jump as it moves with a specified delay between jumps.
  minecraft:movement.skip
 This move control causes the mob to hop as it moves.
  minecraft:movement_sound_distance_offset
 Sets the offset used to determine the next step distance for playing a movement sound.
  minecraft:movement.sway
 This move control causes the mob to sway side to side giving the impression it is swimming.
  minecraft:nameable
 Allows this entity to be named (e.g.
  minecraft:navigation.climb
 Allows this entity to generate paths that include vertical walls like the vanilla Spiders do.
  minecraft:navigation.float
 Allows this entity to generate paths by flying around the air like the regular Ghast.
  minecraft:navigation.fly
 Allows this entity to generate paths in the air like the vanilla Parrots do.
  minecraft:navigation.generic
 Allows this entity to generate paths by walking, swimming, flying and/or climbing around and jumping up and down a block.
  minecraft:navigation.hover
 Allows this entity to generate paths in the air like the vanilla Bees do.
  minecraft:navigation.swim
 Allows this entity to generate paths that include water.
  minecraft:navigation.walk
 Walking style of the mob
  minecraft:offspring
 Defines the way an entity can create a born offspring.
  minecraft:out_of_control
 Defines the entity's 'out of control' state.
  minecraft:peek
 Defines the entity's 'peek' behavior, defining the events that should be called during it.
  minecraft:persistent
 Defines whether an entity should be persistent in the game world.
  minecraft:physics
 Defines physics properties of an actor, including if it is affected by gravity or if it collides with objects.
  minecraft:player.exhaustion
 Defines the player's exhaustion level.
  minecraft:player.experience
 Defines how much experience each player action should take.
  minecraft:player.level
 Defines the player's level.
  minecraft:player.saturation
 Defines the player's need for food.
  minecraft:preferred_path
 Specifies costing information for mobs that prefer to walk on preferred paths.
  minecraft:projectile
 Turns the entity into a projectile: a thrown or shot entity that flies along a ballistic arc and reacts when it impacts a block, a fluid, or another entity.
  minecraft:pushable
 Defines what can push an entity between other entities and pistons.
  minecraft:pushable_by_block
 Allows the entity to be pushed by certain blocks, like Shulker Boxes and Pistons.
  minecraft:pushable_by_entity
 Allows an entity to be pushed by other entities.
  minecraft:push_through
 Sets the distance through which the entity can push through.
  minecraft:raid_trigger
 Attempts to trigger a raid at the entity's location.
  minecraft:rail_movement
 Defines the entity's movement on the rails.
  minecraft:rail_sensor
 Enables minecart-type entities to detect powered rails and respond to activation state changes.
  minecraft:ravager_blocked
 Defines the ravager's response to their melee attack being blocked.
  minecraft:reflect_projectiles
 [EXPERIMENTAL] Allows an entity to reflect projectiles.
  minecraft:remove_in_peaceful
 Denotes entities that are not allowed to exist in "Peaceful" difficulty.
  minecraft:renders_when_invisible
 When set, the entity will render even when invisible.
  minecraft:rideable
 This entity can be ridden
  minecraft:rotation_axis_aligned
 Causes the entity to automatically rotate to align with the nearest cardinal direction based on its current facing direction. Combining this with the "minecraft:body_rotation_blocked" component will cause the entity's body to align with the nearest cardinal direction and remain fixed in that orientation, regardless of changes in its facing direction.
  minecraft:rotation_locked_to_vehicle
 Causes the entity's rotation to match their vehicle's facing direction.
  minecraft:scale
 Sets the entity's visual size multiplier.
  minecraft:scale_by_age
 Defines the entity's size interpolation based on the entity's age.
  minecraft:scheduler
 Fires off scheduled mob events at time of day events.
  minecraft:shareables
 Defines a list of items the mob wants to share or pick up.
  minecraft:shooter
 Defines the entity's ranged attack behavior.
  minecraft:sittable
 Defines the entity's 'sit' state.
  minecraft:skin_id
 Skin ID value.
  minecraft:sound_volume
 Sets the entity's base volume for sound effects.
  minecraft:spawn_egg_interaction
 Enables interacting with this entity using its own spawn egg to spawn a born child.
  minecraft:spawn_entity
 Adds a timer after which this entity will spawn another entity or item (similar to vanilla's chicken's egg-laying behavior).
  minecraft:spawn_on_death
 Component for spawning entities when an entity perishes.
  minecraft:spell_effects
 Allows an entity to add or remove status effects from itself.
  minecraft:strength
 Defines the entity's strength to carry items.
  minecraft:suspect_tracking
 Allows this entity to remember suspicious locations.
  minecraft:tameable
 This entity can be tamed
  minecraft:tamemount
 Allows the Entity to be tamed by mounting it.
  minecraft:target_nearby_sensor
 Defines the entity's range within which it can see or sense other entities to target them.
  minecraft:teleport
 Defines an entity's teleporting behavior.
  minecraft:tick_world
 Defines if the entity ticks the world and the radius around it to tick.
  minecraft:timer
 Adds a timer after which an event will fire.
  Trade Resupply
 Resupplies an entity's trade.
  minecraft:trade_table
 Defines this entity's ability to trade with players.
  minecraft:trail
 Causes an entity to leave a trail of blocks as it moves about the world.
  minecraft:transformation
 Defines an entity's transformation from the current definition into another
  minecraft:transient
 An entity with this component will NEVER persist, and forever disappear when unloaded.
  Trust
 Allows this entity to trust multiple players.
  minecraft:trusting
 Defines the rules for a mob to trust players.
  minecraft:type_family
 Defines the family categories this entity belongs to.
  minecraft:underwater_mount_breathing
 Pauses this entity's breathing under water.
  minecraft:underwater_movement
 Defines the speed with which an entity can move through water.
  minecraft:uses_legacy_friction
 When set, legacy calculations are used when applying "minecraft:friction_modifier".
  minecraft:variable_max_auto_step
 Entities with this component will have a maximum auto step height that is different depending on whether they are on a block that prevents jumping.
  minecraft:variant
 Variant is typically used as a per-type way to express a different visual form of the same mob.
  minecraft:vertical_movement_action
 When configured as a rideable entity, the entity will move upwards or downwards when the player uses the jump action.
  minecraft:vibration_damper
 Vibrations emitted by an entity with this component will be ignored.
  minecraft:vibration_listener
 Allows the entity to listen to vibration events.
  minecraft:walk_animation_speed
 Sets the speed multiplier for this entity's walk animation speed.
  minecraft:wants_jockey
 Sets that this entity wants to become a jockey.
  minecraft:water_movement
 Customizes how the entity moves through water by adjusting drag coefficient.
  minecraft:wither_target_highest_damage
 Allows the wither to focus its attacks on whichever mob has dealt the most damage to it.
 Internal/Deprecated Components
 These components are either deprecated or internal to Minecraft and not usable in custom content.
 Entity Components
 Description
  scaffolding_climber
 Allows the player to detect and manuever on the scaffolding block.
			 Feedback
					Was this page helpful?
						 Yes
						 No
							 No
								Need help with this topic?
								Want to try using Ask Learn to clarify or guide you through this topic?
			 Ask Learn
			 Ask Learn
				  Suggest a fix?
				Additional resources
				 Last updated on
		2026-01-08
			 In this article
					Was this page helpful?
								Need help with this topic?
								Want to try using Ask Learn to clarify or guide you through this topic?
			 Ask Learn
			 Ask Learn
				  Suggest a fix?
		      en-us
			 Your Privacy Choices
				 Theme
							  Light
							  Dark
							  High contrast
		 AI Disclaimer
		 Previous Versions
		 Blog
		 Contribute
		 Privacy
		 Consumer Health Privacy
		 Terms of Use
		 Trademarks
				 &copy; Microsoft 2026
