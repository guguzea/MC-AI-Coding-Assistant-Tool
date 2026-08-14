> 来源：https://learn.microsoft.com/en-us/minecraft/creator/reference/content/blockreference/examples/blockcomponents/blockcomponentslist?view=minecraft-bedrock-stable
> 抓取时间：2026-08-14T18:35:26.703Z
> 警告：此文档可能滞后于当前正式版

Block Components Documentation - Block Components | Microsoft Learn
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
					  Block Components Documentation
			 Feedback
						Summarize this article for me
				In this article
 Block Components
 Description
  block_entity
 Requires Upcoming-Creator-Features enabled.
  minecraft:block_light_absorption
 Legacy component (format_version < 1.19.40).
  minecraft:block_light_emission
 Legacy component (format_version < 1.19.40).
  minecraft:chest_obstruction
 This defines how a block reacts to a chest being opened underneath it.
  minecraft:collision_box
 Defines the area of the block that collides with entities.
  minecraft:connection_rule
 Defines whether other blocks such as fences, walls, bars, and glass panes are allowed to connect to this block.
  minecraft:crafting_table
 Makes your block into a custom crafting table which enables the crafting table UI and the ability to craft recipes.
  minecraft:destroy_time
 Legacy component (format_version < 1.19.40).
  minecraft:destructible_by_explosion
 Describes the destructible by explosion properties for this block.
  minecraft:destructible_by_mining
 Describes the destructible by mining properties for this block.
  Destruction Particles
 Sets the particles that will be used when block is destroyed.
  minecraft:display_name
 Specifies the language file key that maps to what text will be displayed when you hover over the block in your inventory and hotbar.
  minecraft:embedded_visual
 The description identifier of the geometry and material used to render this block when it it is embedded inside of another block (for example, a flower inside of a flower pot).
  minecraft:entity_fall_on
 Configures what distance an entity must fall onto this block to cause the  onEntityFallOn  block custom component event to be sent to script.
  minecraft:explosion_resistance
 Legacy component (format_version < 1.19.40).
  minecraft:flammable
 Describes the flammable properties for this block.
  minecraft:flower_pottable
 When added to a block type, indicates that this block can be placed inside a flower pot.
  minecraft:friction
 Describes the friction for this block in a range of 0.0 to 0.9.
  minecraft:geometry
 The description identifier of the geometry to use to render this block.
  minecraft:instrument_sound
 [Note: This component is currently experimental].
  Item Visual
 The description identifier of the geometry and material used to render the item of this block.
  minecraft:light_dampening
 The amount that light will be dampened when it passes through the block, in a range of 0-15.
  minecraft:light_emission
 The amount of light this block will emit in a range of 0-15.
  Liquid Detection
 The definitions for how a block behaves when detecting liquid.
  minecraft:loot
 Specifies the path to the loot table that determines what items are dropped when the block is destroyed.
  minecraft:map_color
 Sets the color of the block when rendered to a map.
  minecraft:material_instances
 The material instances for a block. Maps face or material_instance names in a geometry file to an actual material instance.
  minecraft:movable
 Defines whether the block can be pushed or pulled by a piston.
  Placement Filter
 Sets rules for under what conditions the block can be placed and survive.
  minecraft:precipitation_interactions
 Determines interactions the block will have with different precipitations.
  minecraft:random_offset
 This component defines a random offset for the block, seeded based on the block's position and the specified range and steps.
  Redstone Conductivity
 The basic redstone properties of a block.
  minecraft:redstone_consumer
 A component describing how a block can consume and potentially propagate a redstone signal.
  minecraft:redstone_producer
 If added to a block, indicates that it produces a redstone signal.
  minecraft:replaceable
 A block with this component can be replaced when another block is placed in the same block position. Experimental toggles required: Upcoming Creator Features (in format versions before 1.21.60)
  minecraft:selection_box
 Defines the area of the block that is selected by the player's cursor (the outline shown when looking at the block).
  minecraft:support
 Defines the support shape of the block.
  minecraft:tick
 Causes the block to tick based on a regular interval equal to a number of ticks randomly chosen from the internal_range parameter.
  Transformation
 The block's translation, rotation and scale with respect to the center of its world position
 Internal/Deprecated Components
 These components are either deprecated or internal to Minecraft and not usable in custom content.
 Block Components
 Description
  bone_visibility
 A JSON object that contains a list of key/value pairs that map from bone name in the specified geometry file (key) to a boolean that tells whether the bone should be visible or not (value).
  breathability
 Determines whether the block is breathable by defining if the block is treated as a  solid  or as  air .
  custom_components
 Sets an ordered list of custom component names which are bound in script to be executed upon a block event.
  queued_ticking
 Triggers the specified event, either once, or at a regular interval equal to a number of ticks randomly chosen from the interval_range provided.
  random_ticking
 Triggers the specified event randomly based on the random tick speed gamerule.
  unit_cube
 Specifies that a unit cube is to be used with tessellation.
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
		2026-06-11
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
