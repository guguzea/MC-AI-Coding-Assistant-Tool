> 来源：https://learn.microsoft.com/en-us/minecraft/creator/reference/content/itemreference/examples/itemcomponentlist?view=minecraft-bedrock-stable
> 抓取时间：2026-08-14T18:35:28.527Z
> 警告：此文档可能滞后于当前正式版

Item Components Documentation - Item Components | Microsoft Learn
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
					  Item Components Documentation
			 Feedback
						Summarize this article for me
				In this article
 Item Components
 Description
  minecraft:allow_off_hand
 The allow_off_hand component determines whether the item can be placed in the off hand slot of the inventory.
  minecraft:block_placer
 Sets the item as a placer item component for blocks.
  minecraft:bundle_interaction
 Enables the bundle-specific interaction scheme and tooltip for an item.
  minecraft:can_destroy_in_creative
 The can_destroy_in_creative component determines if the item can be used by a player to break blocks when in creative mode.
  minecraft:compostable
 Specifies that an item is compostable and provides the chance of creating a composting layer in the composter
  minecraft:cooldown
 Adds a cooldown to an item, preventing it from being used again for a specified duration.
  minecraft:damage
 The damage component determines how much extra damage the item does on attack.
  minecraft:damage_absorption
 It allows an item to absorb damage that would otherwise be dealt to its wearer.
  minecraft:digger
 Configures an item as a digging tool, allowing it to break specific blocks faster than normal.
  minecraft:display_name
 Sets the item display name within Minecraft: Bedrock Edition.
  minecraft:durability
 Sets how much damage the item can take before breaking, and allows the item to be combined at an anvil, grindstone, or crafting table.
  minecraft:durability_sensor
 Enables an item to emit effects when it receives damage.
  minecraft:durability_sensor durability_threshold
 Defines both the durability threshold, and the effects emitted when that threshold is met.
  minecraft:dyeable
 Enables players to dye this item using dyes in a crafting grid, like leather armor.
  minecraft:enchantable
 Determines what enchantments can be applied to the item.
  minecraft:entity_placer
 Allows an item to place entities into the world.
  minecraft:fire_resistant
 Determines whether the item is immune to burning when dropped in fire or lava.
  minecraft:food
 Sets the item as a food component, allowing it to be edible to the player.
  minecraft:fuel
 Allows this item to be used as fuel in a furnace to 'cook' other items.
  minecraft:glint
 Determines whether the item has the enchanted glint render effect on it.
  minecraft:hand_equipped
 The hand_equipped component determines if an item is rendered like a tool while it is in a player's hand.
  minecraft:hover_text_color
 Determines the color of the item name when hovering over it.
  minecraft:icon
 Determines the icon to represent the item in the UI and elsewhere.
  minecraft:interact_button
 A boolean or string that determines if the interact button is shown in touch controls, and what text is displayed on the button.
  minecraft:item v1.26.0
 Refers to the item definition, which includes the 'description' and 'components' sections of the file.
  minecraft:item v1.21.90
 Item definition includes the "description" and "components" sections.
  minecraft:item v1.26.0
 Item definition includes the "description" and "components" sections.
  minecraft:kinetic_weapon
 Allows an item to deal kinetic damage and its effects.
  minecraft:kinetic_weapon kinetic_effect_conditions
 Conditions that need to be satisfied for a specific effect of a kinetic weapon to be applied.
  minecraft:liquid_clipped
 The liquid_clipped component determines whether the item interacts with liquid blocks on use.
  minecraft:max_stack_size
 Determines how many of an item can be stacked together.
  minecraft:piercing_weapon
 Allows an item to deal damage to all entities detected in a straight line along the user's view vector.
  minecraft:projectile
 Defines an item as a projectile that can be shot from dispensers or used as ammunition with minecraft:shooter.
  minecraft:rarity
 Specifies the base rarity and subsequently color of the item name when the player hovers the cursor over the item.
  minecraft:record
 Used by record items to play music.
  minecraft:repairable
 Defines the items that can be used to repair a defined item, and the amount of durability each item restores upon repair.
  minecraft:seed
 Sets the item as a seed that can be planted to grow crops.
  minecraft:shooter
 Compels an item to shoot projectiles, similarly to a bow or crossbow.
  minecraft:should_despawn
 Should_despawn component determines if the item should eventually despawn while floating in the world
  minecraft:stacked_by_data
 The stacked_by_data component determines whether the same items with different aux values can stack.
  minecraft:storage_item
 Enables an item to store data of the dynamic container associated with it.
  minecraft:storage_weight_limit
 Specifies the maximum weight limit that a storage item can hold
  minecraft:storage_weight_modifier
 Specifies the maximum weight limit that a storage item can hold
  minecraft:swing_duration
 Duration, in seconds, of the item's swing animation played when mining or attacking.
  minecraft:swing_sounds
 Overrides the swing sounds emitted by the user.
  minecraft:tags
 Determines which tags are included on a given item
  minecraft:throwable
 Makes an item throwable by the player, similar to a snowball or ender pearl.
  minecraft:use_animation
 Use_animation specifies which animation is played when the player uses the item.
  minecraft:use_modifiers
 Determines how long an item takes to use in combination with components such as Shooter, Throwable, or Food.
  minecraft:wearable
 Sets the wearable item component, which allows an item to be worn by a player in a specified equipment slot.
 Internal/Deprecated Components
 These components are either deprecated or internal to Minecraft and not usable in custom content.
 Item Components
 Description
  chargeable
 Event trigger for when the item has completed its use duration.
  custom_components
 Specifies an array of custom components defined in a script that should be added to this item.
  render_offsets
 Render offsets component: optional values can be given to offset the way the item is rendered.
  use_duration
 This component determines how long the item takes to use when used in combination with components like "shooter", "throwable", or "food".
  weapon
 Deprecated weapon item component.
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
		2026-05-20
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
