> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.239Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityEquippableComponent (class)

```ts
export class EntityEquippableComponent extends EntityComponent {
```

## Members（6）

### `private`
```ts
private constructor();
```

### `totalArmor`
```ts
readonly totalArmor: number;
```

@remarks
Returns the total Armor level of the owner.

@throws This property can throw when used.

{@link InvalidEntityError}
/

### `totalToughness`
```ts
readonly totalToughness: number;
static readonly componentId = 'minecraft:equippable';
```

@remarks
Returns the total Toughness level of the owner.

@throws This property can throw when used.

{@link InvalidEntityError}
/

### `getEquipment`
```ts
getEquipment(equipmentSlot: EquipmentSlot): ItemStack | undefined;
```

@remarks
Gets the equipped item for the given EquipmentSlot.

@param equipmentSlot
The equipment slot. e.g. "head", "chest", "offhand"
@returns
Returns the item equipped to the given EquipmentSlot. If
empty, returns undefined.
@throws This function can throw errors.
/

### `getEquipmentSlot`
```ts
getEquipmentSlot(equipmentSlot: EquipmentSlot): ContainerSlot;
```

@remarks
Gets the ContainerSlot corresponding to the given
EquipmentSlot.

@param equipmentSlot
The equipment slot. e.g. "head", "chest", "offhand".
@returns
Returns the ContainerSlot corresponding to the given
EquipmentSlot.
@throws This function can throw errors.
/

### `setEquipment`
```ts
setEquipment(equipmentSlot: EquipmentSlot, itemStack?: ItemStack): boolean;
```

@remarks
Replaces the item in the given EquipmentSlot.

This function can't be called in restricted-execution mode.

@param equipmentSlot
The equipment slot. e.g. "head", "chest", "offhand".
@param itemStack
The item to equip. If undefined, clears the slot.
@throws This function can throw errors.
/
