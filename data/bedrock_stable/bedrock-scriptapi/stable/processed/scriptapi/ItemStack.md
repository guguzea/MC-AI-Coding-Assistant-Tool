> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.377Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# ItemStack (class)

```ts
export class ItemStack {
```

Defines a collection of items.
@example itemStacks.ts
```typescript
import { ItemStack, DimensionLocation } from '@minecraft/server';
import { MinecraftItemTypes } from '@minecraft/vanilla-data';

function itemStacks(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const oneItemLoc = { x: targetLocation.x + targetLocation.y + 3, y: 2, z: targetLocation.z + 1 };
  const fiveItemsLoc = { x: targetLocation.x + 1, y: targetLocation.y + 2, z: targetLocation.z + 1 };
  const diamondPickaxeLoc = { x: targetLocation.x + 2, y: targetLocation.y + 2, z: targetLocation.z + 4 };

  const oneEmerald = new ItemStack(MinecraftItemTypes.Emerald, 1);
  const onePickaxe = new ItemStack(MinecraftItemTypes.DiamondPickaxe, 1);
  const fiveEmeralds = new ItemStack(MinecraftItemTypes.Emerald, 5);

  log(`Spawning an emerald at (${oneItemLoc.x}, ${oneItemLoc.y}, ${oneItemLoc.z})`);
  targetLocation.dimension.spawnItem(oneEmerald, oneItemLoc);

  log(`Spawning five emeralds at (${fiveItemsLoc.x}, ${fiveItemsLoc.y}, ${fiveItemsLoc.z})`);
  targetLocation.dimension.spawnItem(fiveEmeralds, fiveItemsLoc);

  log(`Spawning a diamond pickaxe at (${diamondPickaxeLoc.x}, ${diamondPickaxeLoc.y}, ${diamondPickaxeLoc.z})`);
  targetLocation.dimension.spawnItem(onePickaxe, diamondPickaxeLoc);
}
```
@example givePlayerEquipment.ts
```typescript
import {
  world,
  ItemStack,
  EntityEquippableComponent,
  EquipmentSlot,
  EntityComponentTypes,
  DimensionLocation,
} from '@minecraft/server';
import { MinecraftItemTypes } from '@minecraft/vanilla-data';

function givePlayerEquipment(targetLocation: DimensionLocation) {
  const players = world.getAllPlayers();

  const armorStandLoc = { x: targetLocation.x, y: targetLocation.y, z: targetLocation.z + 4 };
  const armorStand = players[0].dimension.spawnEntity(MinecraftItemTypes.ArmorStand, armorStandLoc);

  const equipmentCompPlayer = players[0].getComponent(EntityComponentTypes.Equippable) as EntityEquippableComponent;
  if (equipmentCompPlayer) {
    equipmentCompPlayer.setEquipment(EquipmentSlot.Head, new ItemStack(MinecraftItemTypes.GoldenHelmet));
    equipmentCompPlayer.setEquipment(EquipmentSlot.Chest, new ItemStack(MinecraftItemTypes.IronChestplate));
    equipmentCompPlayer.setEquipment(EquipmentSlot.Legs, new ItemStack(MinecraftItemTypes.DiamondLeggings));
    equipmentCompPlayer.setEquipment(EquipmentSlot.Feet, new ItemStack(MinecraftItemTypes.NetheriteBoots));
    equipmentCompPlayer.setEquipment(EquipmentSlot.Mainhand, new ItemStack(MinecraftItemTypes.WoodenSword));
    equipmentCompPlayer.setEquipment(EquipmentSlot.Offhand, new ItemStack(MinecraftItemTypes.Shield));
  }

  const equipmentCompArmorStand = armorStand.getComponent(EntityComponentTypes.Equippable) as EntityEquippableComponent;
  if (equipmentCompArmorStand) {
    equipmentCompArmorStand.setEquipment(EquipmentSlot.Head, new ItemStack(MinecraftItemTypes.GoldenHelmet));
    equipmentCompArmorStand.setEquipment(EquipmentSlot.Chest, new ItemStack(MinecraftItemTypes.IronChestplate));
    equipmentCompArmorStand.setEquipment(EquipmentSlot.Legs, new ItemStack(MinecraftItemTypes.DiamondLeggings));
    equipmentCompArmorStand.setEquipment(EquipmentSlot.Feet, new ItemStack(MinecraftItemTypes.NetheriteBoots));
    equipmentCompArmorStand.setEquipment(EquipmentSlot.Mainhand, new ItemStack(MinecraftItemTypes.WoodenSword));
    equipmentCompArmorStand.setEquipment(EquipmentSlot.Offhand, new ItemStack(MinecraftItemTypes.Shield));
  }
}
```
@example spawnFeatherItem.ts
```typescript
import { ItemStack, DimensionLocation } from '@minecraft/server';
import { MinecraftItemTypes } from '@minecraft/vanilla-data';

function spawnFeatherItem(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const featherItem = new ItemStack(MinecraftItemTypes.Feather, 1);

  targetLocation.dimension.spawnItem(featherItem, targetLocation);
  log(`New feather created at ${targetLocation.x}, ${targetLocation.y}, ${targetLocation.z}!`);
}
```

## Members（32）

### `amount`
```ts
amount: number;
```

@remarks
Number of the items in the stack. Valid values range between
1-255. The provided value will be clamped to the item's
maximum stack size.

This property can't be edited in restricted-execution mode.

Bounds: [1, 255]
@throws
Throws if the value is outside the range of 1-255.
/

### `isStackable`
```ts
readonly isStackable: boolean;
```

@remarks
Returns whether the item is stackable. An item is considered
stackable if the item's maximum stack size is greater than 1
and the item does not contain any custom data or properties.

/

### `keepOnDeath`
```ts
keepOnDeath: boolean;
```

@remarks
Gets or sets whether the item is kept on death.

This property can't be edited in restricted-execution mode.

/

### `localizationKey`
```ts
readonly localizationKey: string;
```

@remarks
Key for the localization of this items's name used in .lang
files.

@throws This property can throw when used.

{@link minecraftcommon.EngineError}
/

### `lockMode`
```ts
lockMode: ItemLockMode;
```

@remarks
Gets or sets the item's lock mode. The default value is
`ItemLockMode.none`.

This property can't be edited in restricted-execution mode.

/

### `maxAmount`
```ts
readonly maxAmount: number;
```

@remarks
The maximum stack size. This value varies depending on the
type of item. For example, torches have a maximum stack size
of 64, while eggs have a maximum stack size of 16.

/

### `nameTag`
```ts
nameTag?: string;
```

@remarks
Given name of this stack of items. The name tag is displayed
when hovering over the item. Setting the name tag to an
empty string or `undefined` will remove the name tag.

This property can't be edited in restricted-execution mode.

@throws
Throws if the length exceeds 255 characters.
/

### `readonly`
```ts
readonly 'type': ItemType;
```

@remarks
The type of the item.

/

### `typeId`
```ts
readonly typeId: string;
```

@remarks
Identifier of the type of items for the stack. If a
namespace is not specified, 'minecraft:' is assumed.
Examples include 'wheat' or 'apple'.

/

### `weight`
```ts
readonly weight: number;
```

@remarks
The total weight of all items in the stack plus the weight
of all items in the items container which is defined with
the `Storage Item` component. The weight per item can be
modified by the `Storage Weight Modifier` component.

/

### `constructor`
```ts
constructor(itemType: ItemType | string, amount?: number);
```

@remarks
Creates a new instance of a stack of items for use in the
world.

@param itemType
Type of item to create. See the {@link
@minecraft/vanilla-data.MinecraftItemTypes} enumeration for
a list of standard item types in Minecraft experiences.
@param amount
Number of items to place in the stack, between 1-255. The
provided value will be clamped to the item's maximum stack
size. Note that certain items can only have one item in the
stack.
Defaults to: 1
Bounds: [1, 255]
@throws
Throws if `itemType` is invalid, or if `amount` is outside
the range of 1-255.
/

### `clearDynamicProperties`
```ts
clearDynamicProperties(): void;
```

@remarks
Clears all dynamic properties that have been set on this
item stack.

/

### `clone`
```ts
clone(): ItemStack;
```

@remarks
Creates an exact copy of the item stack, including any
custom data or properties.

@returns
Returns a copy of this item stack.
/

### `getCanDestroy`
```ts
getCanDestroy(): string[];
```

@remarks
Get the list of block types this item can break in Adventure
mode.

This function can't be called in restricted-execution mode.

/

### `getCanPlaceOn`
```ts
getCanPlaceOn(): string[];
```

@remarks
Get the list of block types this item can be placed on in
Adventure mode.

This function can't be called in restricted-execution mode.

/

### `getComponent`
```ts
getComponent<T extends string>(componentId: T): ItemComponentReturnType<T> | undefined;
```

@remarks
Gets a component (that represents additional capabilities)
for an item stack.

@param componentId
The identifier of the component (e.g., 'minecraft:food'). If
no namespace prefix is specified, 'minecraft:' is assumed.
Available component IDs are those in the {@link
ItemComponentTypes} enum and custom component IDs registered
with the {@link ItemComponentRegistry}.
@returns
Returns the component if it exists on the item stack,
otherwise undefined.
@example giveHurtDiamondSword.ts
```typescript
import {
  world,
  ItemStack,
  EntityInventoryComponent,
  EntityComponentTypes,
  ItemComponentTypes,
  ItemDurabilityComponent,
  DimensionLocation,
} from '@minecraft/server';
import { MinecraftItemTypes } from '@minecraft/vanilla-data';

function giveHurtDiamondSword(targetLocation: DimensionLocation) {
  const hurtDiamondSword = new ItemStack(MinecraftItemTypes.DiamondSword);

  const durabilityComponent = hurtDiamondSword.getComponent(ItemComponentTypes.Durability) as ItemDurabilityComponent;

  if (durabilityComponent !== undefined) {
    durabilityComponent.damage = durabilityComponent.maxDurability / 2;
  }

  for (const player of world.getAllPlayers()) {
    const inventory = player.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent;
    if (inventory && inventory.container) {
      inventory.container.addItem(hurtDiamondSword);
    }
  }
}
```
/

### `getComponents`
```ts
getComponents(): ItemComponent[];
```

@remarks
Returns all scripting components that are present on this
item stack.

/

### `getDynamicProperty`
```ts
getDynamicProperty(identifier: string): boolean | number | string | Vector3 | undefined;
```

@remarks
Returns a property value.

@param identifier
The property identifier.
@returns
Returns the value for the property, or undefined if the
property has not been set.
/

### `getDynamicPropertyIds`
```ts
getDynamicPropertyIds(): string[];
```

@remarks
Returns the available set of dynamic property identifiers
that have been used on this entity.

@returns
A string array of the dynamic properties set on this entity.
/

### `getDynamicPropertyTotalByteCount`
```ts
getDynamicPropertyTotalByteCount(): number;
```

@remarks
Returns the total size, in bytes, of all the dynamic
properties that are currently stored for this entity. This
includes the size of both the key and the value.  This can
be useful for diagnosing performance warning signs - if, for
example, an entity has many megabytes of associated dynamic
properties, it may be slow to load on various devices.

/

### `getLore`
```ts
getLore(): string[];
```

@remarks
Returns the lore value - a secondary display string - for an
ItemStack.

@returns
An array of lore lines. If the item does not have lore,
returns an empty array.
/

### `getRawLore`
```ts
getRawLore(): RawMessage[];
```

@remarks
Returns the lore value - a secondary display string - for an
ItemStack. String lore lines will be converted to a {@link
RawMessage} and put under {@link RawMessage.text}.

@returns
An array of lore lines. If the item does not have lore,
returns an empty array.
/

### `getTags`
```ts
getTags(): string[];
```

@remarks
Returns a set of tags associated with this item stack.

/

### `hasComponent`
```ts
hasComponent(componentId: string): boolean;
```

@remarks
Returns true if the specified component is present on this
item stack.

@param componentId
The identifier of the component (e.g., 'minecraft:food') to
retrieve. If no namespace prefix is specified, 'minecraft:'
is assumed.
/

### `hasTag`
```ts
hasTag(tag: string): boolean;
```

@remarks
Checks whether this item stack has a particular tag
associated with it.

@param tag
Tag to search for.
@returns
True if the Item Stack has the tag associated with it, else
false.
/

### `isStackableWith`
```ts
isStackableWith(itemStack: ItemStack): boolean;
```

@remarks
Returns whether this item stack can be stacked with the
given `itemStack`. This is determined by comparing the item
type and any custom data and properties associated with the
item stacks. The amount of each item stack is not taken into
consideration, but for non-stackable items this will always
return false.

@param itemStack
ItemStack to check stacking compatibility with.
@returns
True if the Item Stack is stackable with the itemStack
passed in. False for non-stackable items.
/

### `matches`
```ts
matches(itemName: string, states?: Record<string, boolean | number | string>): boolean;
```

@remarks
Version safe way of checking if an item matches.

@param itemName
Identifier of the item.
@param states
 Applicable only for blocks. An optional set of states to
compare against. If states is not specified, matches checks
against the set of types more broadly.
@returns
Returns a boolean whether the specified item matches.
/

### `setCanDestroy`
```ts
setCanDestroy(blockIdentifiers?: string[]): void;
```

@remarks
The list of block types this item can break in Adventure
mode. The block names are displayed in the item's tooltip.
Setting the value to undefined will clear the list.

This function can't be called in restricted-execution mode.

@param blockIdentifiers
String list of block types that the item can destroy.
@throws
Throws if any of the provided block identifiers are invalid.
@example giveDestroyRestrictedPickaxe.ts
```typescript
import { world, ItemStack, EntityInventoryComponent, DimensionLocation } from '@minecraft/server';
import { MinecraftItemTypes } from '@minecraft/vanilla-data';

function giveDestroyRestrictedPickaxe(targetLocation: DimensionLocation) {
  for (const player of world.getAllPlayers()) {
    const specialPickaxe = new ItemStack(MinecraftItemTypes.DiamondPickaxe);
    specialPickaxe.setCanDestroy([MinecraftItemTypes.Cobblestone, MinecraftItemTypes.Obsidian]);

    const inventory = player.getComponent('inventory') as EntityInventoryComponent;
    if (inventory === undefined || inventory.container === undefined) {
      return;
    }

    inventory.container.addItem(specialPickaxe);
  }
}
```
/

### `setCanPlaceOn`
```ts
setCanPlaceOn(blockIdentifiers?: string[]): void;
```

@remarks
The list of block types this item can be placed on in
Adventure mode. This is only applicable to block items. The
block names are displayed in the item's tooltip. Setting the
value to undefined will clear the list.

This function can't be called in restricted-execution mode.

@param blockIdentifiers
String list of block types that the item can be placed on.
@throws
Throws if any of the provided block identifiers are invalid.
@example givePlaceRestrictedGoldBlock.ts
```typescript
import { world, ItemStack, EntityInventoryComponent, EntityComponentTypes, DimensionLocation } from '@minecraft/server';
import { MinecraftItemTypes } from '@minecraft/vanilla-data';

function givePlaceRestrictedGoldBlock(targetLocation: DimensionLocation) {
  for (const player of world.getAllPlayers()) {
    const specialGoldBlock = new ItemStack(MinecraftItemTypes.GoldBlock);
    specialGoldBlock.setCanPlaceOn([MinecraftItemTypes.GrassBlock, MinecraftItemTypes.Dirt]);

    const inventory = player.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent;
    if (inventory === undefined || inventory.container === undefined) {
      return;
    }

    inventory.container.addItem(specialGoldBlock);
  }
}
```
/

### `setDynamicProperties`
```ts
setDynamicProperties(values: Record<string, boolean | number | string | Vector3 | undefined>): void;
```

@remarks
Sets multiple dynamic properties with specific values.

@param values
A Record of key value pairs of the dynamic properties to
set. If the data value is null, it will remove that property
instead.
@throws This function can throw errors.

{@link minecraftcommon.ArgumentOutOfBoundsError}

{@link minecraftcommon.UnsupportedFunctionalityError}
/

### `setDynamicProperty`
```ts
setDynamicProperty(identifier: string, value?: boolean | number | string | Vector3): void;
```

@remarks
Sets a specified property to a value. Note: This function
only works with non-stackable items.

@param identifier
The property identifier.
@param value
Data value of the property to set. If the value is null, it
will remove the property instead.
@throws
Throws if the item stack is stackable.

{@link minecraftcommon.ArgumentOutOfBoundsError}

{@link minecraftcommon.UnsupportedFunctionalityError}
/

### `setLore`
```ts
setLore(loreList?: (RawMessage | string)[]): void;
```

@remarks
Sets the lore value - a secondary display string - for an
ItemStack. The lore list is cleared if set to an empty
string or undefined.

This function can't be called in restricted-execution mode.

@param loreList
List of lore lines. Each element in the list represents a
new line. The maximum lore line count is 20. The maximum
lore line length is 50 characters.
@throws This function can throw errors.

{@link minecraftcommon.ArgumentOutOfBoundsError}

{@link Error}
@example diamondAwesomeSword.ts
```typescript
import { EntityComponentTypes, ItemStack, Player } from '@minecraft/server';
import { MinecraftItemTypes } from '@minecraft/vanilla-data';

function giveAwesomeSword(player: Player) {
  const diamondAwesomeSword = new ItemStack(MinecraftItemTypes.DiamondSword, 1);
  diamondAwesomeSword.setLore(['§c§lDiamond Sword of Awesome§r', '+10 coolness', '§p+4 shiny§r']);

  // hover over/select the item in your inventory to see the lore.
  const inventory = player.getComponent(EntityComponentTypes.Inventory);
  if (inventory === undefined || inventory.container === undefined) {
    return;
  }

  inventory.container.setItem(0, diamondAwesomeSword);
}
```
/
