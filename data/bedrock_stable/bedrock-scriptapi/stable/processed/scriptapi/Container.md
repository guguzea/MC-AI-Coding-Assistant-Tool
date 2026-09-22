> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.191Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# Container (class)

```ts
export class Container {
```

Represents a container that can hold sets of items. Used
with entities such as Players, Chest Minecarts, Llamas, and
more.
@example containers.ts
```typescript
import { ItemStack, EntityInventoryComponent, BlockInventoryComponent, DimensionLocation } from '@minecraft/server';
import { MinecraftBlockTypes, MinecraftItemTypes, MinecraftEntityTypes } from '@minecraft/vanilla-data';

function containers(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const xLocation = targetLocation; // left chest location
  const xPlusTwoLocation = { x: targetLocation.x + 2, y: targetLocation.y, z: targetLocation.z }; // right chest

  const chestCart = targetLocation.dimension.spawnEntity(MinecraftEntityTypes.ChestMinecart, {
    x: targetLocation.x + 4,
    y: targetLocation.y,
    z: targetLocation.z,
  });

  const xChestBlock = targetLocation.dimension.getBlock(xLocation);
  const xPlusTwoChestBlock = targetLocation.dimension.getBlock(xPlusTwoLocation);

  if (!xChestBlock || !xPlusTwoChestBlock) {
    log('Could not retrieve chest blocks.');
    return;
  }

  xChestBlock.setType(MinecraftBlockTypes.Chest);
  xPlusTwoChestBlock.setType(MinecraftBlockTypes.Chest);

  const xPlusTwoChestInventoryComp = xPlusTwoChestBlock.getComponent('inventory') as BlockInventoryComponent;
  const xChestInventoryComponent = xChestBlock.getComponent('inventory') as BlockInventoryComponent;
  const chestCartInventoryComp = chestCart.getComponent('inventory') as EntityInventoryComponent;

  const xPlusTwoChestContainer = xPlusTwoChestInventoryComp.container;
  const xChestContainer = xChestInventoryComponent.container;
  const chestCartContainer = chestCartInventoryComp.container;

  if (!xPlusTwoChestContainer || !xChestContainer || !chestCartContainer) {
    log('Could not retrieve chest containers.');
    return;
  }

  xPlusTwoChestContainer.setItem(0, new ItemStack(MinecraftItemTypes.Apple, 10));
  if (xPlusTwoChestContainer.getItem(0)?.typeId !== MinecraftItemTypes.Apple) {
    log('Expected apple in x+2 container slot index 0', -1);
  }

  xPlusTwoChestContainer.setItem(1, new ItemStack(MinecraftItemTypes.Emerald, 10));
  if (xPlusTwoChestContainer.getItem(1)?.typeId !== MinecraftItemTypes.Emerald) {
    log('Expected emerald in x+2 container slot index 1', -1);
  }

  if (xPlusTwoChestContainer.size !== 27) {
    log('Unexpected size: ' + xPlusTwoChestContainer.size, -1);
  }

  if (xPlusTwoChestContainer.emptySlotsCount !== 25) {
    log('Unexpected emptySlotsCount: ' + xPlusTwoChestContainer.emptySlotsCount, -1);
  }

  xChestContainer.setItem(0, new ItemStack(MinecraftItemTypes.Cake, 10));

  xPlusTwoChestContainer.transferItem(0, chestCartContainer); // transfer the apple from the xPlusTwo chest to a chest cart
  xPlusTwoChestContainer.swapItems(1, 0, xChestContainer); // swap the cake from x and the emerald from xPlusTwo

  if (chestCartContainer.getItem(0)?.typeId !== MinecraftItemTypes.Apple) {
    log('Expected apple in minecraft chest container slot index 0', -1);
  }

  if (xChestContainer.getItem(0)?.typeId === MinecraftItemTypes.Emerald) {
    log('Expected emerald in x container slot index 0', -1);
  }

  if (xPlusTwoChestContainer.getItem(1)?.typeId === MinecraftItemTypes.Cake) {
    log('Expected cake in x+2 container slot index 1', -1);
  }
}
```

## Members（19）

### `private`
```ts
private constructor();
```

### `containerRules`
```ts
readonly containerRules?: ContainerRules;
```

@remarks
If these rules are defined other container operations will
throw if they cause these rules to be invalidated. For
example, adding a shulker box to a vanilla bundle.

/

### `emptySlotsCount`
```ts
readonly emptySlotsCount: number;
```

@remarks
Count of the slots in the container that are empty.

@throws
Throws if the container is invalid.
/

### `isValid`
```ts
readonly isValid: boolean;
```

@remarks
Returns whether a container object (or the entity or block
that this container is associated with) is still available
for use in this context.

/

### `size`
```ts
readonly size: number;
```

@remarks
The number of slots in this container. For example, a
standard single-block chest has a size of 27. Note, a
player's inventory container contains a total of 36 slots, 9
hotbar slots plus 27 inventory slots.

@throws
Throws if the container is invalid.
/

### `weight`
```ts
readonly weight: number;
```

@remarks
The combined weight of all items in the container.

@throws This property can throw when used.

{@link InvalidContainerError}
/

### `addItem`
```ts
addItem(itemStack: ItemStack): ItemStack | undefined;
```

@remarks
Adds an item to the container. The item is placed in the
first available slot(s) and can be stacked with existing
items of the same type. Note, use {@link Container.setItem}
if you wish to set the item in a particular slot.

This function can't be called in restricted-execution mode.

@param itemStack
The stack of items to add.
@throws This function can throw errors.

{@link ContainerRulesError}

{@link Error}
/

### `clearAll`
```ts
clearAll(): void;
```

@remarks
Clears all inventory items in the container.

This function can't be called in restricted-execution mode.

@throws
Throws if the container is invalid.
/

### `contains`
```ts
contains(itemStack: ItemStack): boolean;
```

@remarks
Attempts to find an item inside the container

@param itemStack
The item to find.
@throws This function can throw errors.

{@link InvalidContainerError}
/

### `find`
```ts
find(itemStack: ItemStack): number | undefined;
```

@remarks
Find the index of the first instance of an item inside the
container

@param itemStack
The item to find.
@throws This function can throw errors.

{@link InvalidContainerError}
/

### `findLast`
```ts
findLast(itemStack: ItemStack): number | undefined;
```

@remarks
Find the index of the last instance of an item inside the
container

@param itemStack
The item to find.
@throws This function can throw errors.

{@link InvalidContainerError}
/

### `firstEmptySlot`
```ts
firstEmptySlot(): number | undefined;
```

@remarks
Finds the index of the first empty slot inside the container

@throws This function can throw errors.

{@link InvalidContainerError}
/

### `firstItem`
```ts
firstItem(): number | undefined;
```

@remarks
Finds the index of the first item inside the container

@throws This function can throw errors.

{@link InvalidContainerError}
/

### `getItem`
```ts
getItem(slot: number): ItemStack | undefined;
```

@remarks
Gets an {@link ItemStack} of the item at the specified slot.
If the slot is empty, returns `undefined`. This method does
not change or clear the contents of the specified slot. To
get a reference to a particular slot, see {@link
Container.getSlot}.

@param slot
Zero-based index of the slot to retrieve items from.
Minimum value: 0
@throws
Throws if the container is invalid or if the `slot` index is
out of bounds.
@example getFirstHotbarItem.ts
```typescript
import { world, EntityInventoryComponent, DimensionLocation } from '@minecraft/server';

function getFirstHotbarItem(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  for (const player of world.getAllPlayers()) {
    const inventory = player.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent;
    if (inventory && inventory.container) {
      const firstItem = inventory.container.getItem(0);

      if (firstItem) {
        log('First item in hotbar is: ' + firstItem.typeId);
      }

      return inventory.container.getItem(0);
    }
    return undefined;
  }
}
```
/

### `getSlot`
```ts
getSlot(slot: number): ContainerSlot;
```

@remarks
Returns a container slot. This acts as a reference to a slot
at the given index for this container.

@param slot
The index of the slot to return. This index must be within
the bounds of the container.
Minimum value: 0
@throws
Throws if the container is invalid or if the `slot` index is
out of bounds.
/

### `moveItem`
```ts
moveItem(fromSlot: number, toSlot: number, toContainer: Container): void;
```

@remarks
Moves an item from one slot to another, potentially across
containers.

This function can't be called in restricted-execution mode.

@param fromSlot
Zero-based index of the slot to transfer an item from, on
this container.
Minimum value: 0
@param toSlot
Zero-based index of the slot to transfer an item to, on
`toContainer`.
Minimum value: 0
@param toContainer
Target container to transfer to. Note this can be the same
container as the source.
@throws
Throws if either this container or `toContainer` are invalid
or if the `fromSlot` or `toSlot` indices out of bounds.

{@link ContainerRulesError}

{@link Error}
@example moveBetweenContainers.ts
```typescript
import { world, EntityInventoryComponent, EntityComponentTypes, DimensionLocation } from '@minecraft/server';
import { MinecraftEntityTypes } from '@minecraft/vanilla-data';

function moveBetweenContainers(targetLocation: DimensionLocation) {
  const players = world.getAllPlayers();

  const chestCart = targetLocation.dimension.spawnEntity(MinecraftEntityTypes.ChestMinecart, {
    x: targetLocation.x + 1,
    y: targetLocation.y,
    z: targetLocation.z,
  });

  if (players.length > 0) {
    const fromPlayer = players[0];

    const fromInventory = fromPlayer.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent;
    const toInventory = chestCart.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent;

    if (fromInventory && toInventory && fromInventory.container && toInventory.container) {
      fromInventory.container.moveItem(0, 0, toInventory.container);
    }
  }
}
```
/

### `setItem`
```ts
setItem(slot: number, itemStack?: ItemStack): void;
```

@remarks
Sets an item stack within a particular slot.

This function can't be called in restricted-execution mode.

@param slot
Zero-based index of the slot to set an item at.
Minimum value: 0
@param itemStack
Stack of items to place within the specified slot. Setting
`itemStack` to undefined will clear the slot.
@throws
Throws if the container is invalid or if the `slot` index is
out of bounds.

{@link ContainerRulesError}

{@link Error}
/

### `swapItems`
```ts
swapItems(slot: number, otherSlot: number, otherContainer: Container): void;
```

@remarks
Swaps items between two different slots within containers.

This function can't be called in restricted-execution mode.

@param slot
Zero-based index of the slot to swap from this container.
Minimum value: 0
@param otherSlot
Zero-based index of the slot to swap with.
Minimum value: 0
@param otherContainer
Target container to swap with. Note this can be the same
container as this source.
@throws
Throws if either this container or `otherContainer` are
invalid or if the `slot` or `otherSlot` are out of bounds.

{@link ContainerRulesError}

{@link Error}
/

### `transferItem`
```ts
transferItem(fromSlot: number, toContainer: Container): ItemStack | undefined;
```

@remarks
Moves an item from one slot to another container, or to the
first available slot in the same container.

This function can't be called in restricted-execution mode.

@param fromSlot
Zero-based index of the slot to transfer an item from, on
this container.
Minimum value: 0
@param toContainer
Target container to transfer to. Note this can be the same
container as the source.
@returns
An itemStack with the items that couldn't be transferred.
Returns undefined if all items were transferred.
@throws
Throws if either this container or `toContainer` are invalid
or if the `fromSlot` or `toSlot` indices out of bounds.

{@link ContainerRulesError}

{@link Error}
@example transferBetweenContainers.ts
```typescript
import { world, EntityInventoryComponent, EntityComponentTypes, DimensionLocation } from '@minecraft/server';
import { MinecraftEntityTypes } from '@minecraft/vanilla-data';

function transferBetweenContainers(targetLocation: DimensionLocation) {
  const players = world.getAllPlayers();

  const chestCart = targetLocation.dimension.spawnEntity(MinecraftEntityTypes.ChestMinecart, {
    x: targetLocation.x + 1,
    y: targetLocation.y,
    z: targetLocation.z,
  });

  if (players.length > 0) {
    const fromPlayer = players[0];

    const fromInventory = fromPlayer.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent;
    const toInventory = chestCart.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent;

    if (fromInventory && toInventory && fromInventory.container && toInventory.container) {
      fromInventory.container.transferItem(0, toInventory.container);
    }
  }
}
```
/
