> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.267Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityInventoryComponent (class)

```ts
export class EntityInventoryComponent extends EntityComponent {
```

## Members（8）

### `private`
```ts
private constructor();
```

### `additionalSlotsPerStrength`
```ts
readonly additionalSlotsPerStrength: number;
```

@remarks
Number of slots that this entity can gain per extra
strength.

@throws This property can throw when used.
/

### `canBeSiphonedFrom`
```ts
readonly canBeSiphonedFrom: boolean;
```

@remarks
If true, the contents of this inventory can be removed by a
hopper.

@throws This property can throw when used.
/

### `container`
```ts
readonly container: Container;
```

@remarks
Defines the container for this entity. The container will be
undefined if the entity has been removed.

@throws This property can throw when used.

{@link InvalidEntityError}
/

### `containerType`
```ts
readonly containerType: string;
```

@remarks
Type of container this entity has.

@throws This property can throw when used.
/

### `inventorySize`
```ts
readonly inventorySize: number;
```

@remarks
Number of slots the container has.

@throws This property can throw when used.
/

### `readonly`
```ts
readonly 'private': boolean;
```

@remarks
If true, the entity will not drop it's inventory on death.

@throws This property can throw when used.
/

### `restrictToOwner`
```ts
readonly restrictToOwner: boolean;
static readonly componentId = 'minecraft:inventory';
```

@remarks
If true, the entity's inventory can only be accessed by its
owner or itself.

@throws This property can throw when used.
/
