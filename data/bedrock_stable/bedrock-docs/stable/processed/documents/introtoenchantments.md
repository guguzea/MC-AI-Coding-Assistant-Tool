> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/introtoenchantments?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:50:15.352Z
> 警告：此文档可能滞后于当前正式版

# Enchantments

Enchantments are a property of items in Minecraft that improve an item's existing abilities or give them additional abilities. Players can obtain items that are enchanted by various means, but they can also enchant items themselves.

The main methods to enchant an item are:

- Using an enchanting table : Players can use the enchanting table item and pay experience points and lapis lazuli to enchant an item. Only items with no enchantments can be enchanted this way.

- Librarian villager : The librarian villager will enchant books for players at the cost of emeralds, rather than experience points and lapis lazuli.

- Using an anvil : Players can combine an item with an enchanted book or with another identical item that has a different enchantment. The resulting item will have both enchantments.

- /enchant command : The /enchant command will enchant the item held in the main hand of the target player.

## List of Enchantments

Here is a list of all enchantments in vanilla Minecraft. In Survival mode, enchantments can be added to certain items that are equipped to certain slots. For example, some enchantments can only be granted to items for the helmet slot, while others can be granted to tools such as pickaxes, shovels, axes, and hoes. The following table lists the enchantments available, their effect on the items they're granted to, and the item types (slots) that they can be enchanted onto.

 Name
 Effect

 Eligible Slots

 Aqua Affinity
 Increases speed when mining under water.

 Helmet, Turtle Shell

 Bane of Arthropods
 Increases the damage dealt to mobs in the arthropod family and applies slowness to them when hit.

 Sword, Axe

 Blast Protection
 Reduces the damage and knockback from explosions.

 Helmet, Chestplate, Leggings, Boots, Turtle Shell

 Breach
 Reduces the protection granted by armor.

 Mace

 Channeling
 Thrown trident will summon a lightning bolt when the target is hit.

 Trident

 Cleaving
 Increases the damage dealt by melee attacks and the increases the length of time that shields are disabled after performing a melee attack.

 Axe

 Curse of Binding
 Item cannot be removed once it is equipped. The item can only be removed when it breaks or when the wearer dies.

 Curse of Vanishing
 Item will disappear on death.

 Depth Strider
 Increases movement speed under water.

 Boots

 Density
 Increases the damage dealt by maces per block fallen when performing smashing attacks.

 Mace

 Efficiency
 Increases the speed with which a tool will break a block. The proper tool for the block must be used in order to receive the bonus from this enchantment.

 Pickaxe, Shovel, Axe, Hoe

 Feather Falling
 Reduces the damage taken from falling.

 Boots

 Fire Aspect
 Sets the target on fire after performing a melee attack.

 Sword, Axe

 Fire Protection
 Reduces the damage taken from fire and reduces burning time.

 Helmet, Chestplate, Leggings, Boots, Turtle Shell

 Flame
 Arrows are ignited when shot and deal fire damage.

 Bow

 Fortune
 Increases the amount of blocks dropped.

 Pickaxe, Shovel, Axe, Hoe

 Frost Walker
 Freezes water as players walk on it.

 Impaling
 Increases the damage dealt to mobs in water or during rain.

 Trident

 Infinity
 Normal arrows will not be consumed when shooting.

 Bow

 Knockback
 Increases the knockback dealt by melee attacks.

 Sowrd

 Looting
 Increases the chances of finding good loot when mobs are killed.

 Sword

 Loyalty
 Thrown trident will return.

 Trident

 Luck of the Sea
 Increases the chances of finding good loot when fishing.

 Fishing Rod

 Lure
 Decreases the time it takes for fish to bite.

 Fishing Rod

 Mending
 Item will be repaired at the cost of experience.

 Multishot
 Fires three arrows per shot.

 Crossbow

 Piercing
 Arrows will pierce through entities and continue to travel. Arrows can pierce multiple entities.

 Crossbow

 Power
 Increases the damage dealt by arrows.

 Bow

 Projectile Protection
 Reduces the damage taken from projectiles.

 Helmet, Chestplate, Leggings, Boots, Turtle Shell

 Protection
 Reduces the damage taken.

 Helmet, Chestplate, Leggings, Boots, Turtle Shell

 Punch
 Increases the knockback dealt by arrows.

 Bow

 Quick Charge
 Decreases crossbow charging time.

 Crossbow

 Respiration
 Increases underwater breathing time.

 Helmet, Turtle Shell

 Riptide
 Thrown trident will launch the player with it while standing in water or during rain.

 Trident

 Sharpness
 Increases damage dealt by melee attacks.

 Sword, Axe

 Silk Touch
 Mined blocks will drop to the ground when destroyed.

 Pickaxe, Shovel, Axe, Hoe

 Smite
 Increases damage dealt to mobs in the undead family.

 Sword, Axe

 Soul Speed
 Increases movement speed on soul sand and soul soil.

 Swift Sneak
 Increases sneaking speed.

 Thorns
 Taking damage deals damage to the attacker.

 Chestplate

 Unbreaking
 Reduces the durability damage this item takes.

 Helmet, Chestplate, Leggings, Boots, Pickaxe, Shovel, Axe, Hoe, Fishing Rod, Sword, Trident, Bow, Crossbow, Turtle Shell

 Wind Burst
 Launches the player into the air after performing a smash attack.

 Mace

## Adding Enchanted Items

Custom items can be enchanted, as well. Enchanted custom items are a great way to introduce story elements to a Minecraft experience or to add puzzle-solving or strategy elements to other types of Minecraft worlds. For example, you can use a Riptide trident to help players traverse a jumping puzzle with carefully placed water or localized rain. You could also include airdrops containing items with powerful enchantments like Multishot or Protection and combine them with a Curse of Vanishing so that they disappear when the player who looted them dies - the possibilities are endless!

To refresh your memory on how to add custom items, see Adding Custom Items .

Once you have created your resource pack and added your items, make sure that your item's .json file contains the minecraft:enchantable component. Here's an example of an enchanted chest armor that has the Blast Protection enchantment.

```json
"minecraft:enchantable": {
 "value": 3,
 "slot": "armor_torso"
}
```

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
