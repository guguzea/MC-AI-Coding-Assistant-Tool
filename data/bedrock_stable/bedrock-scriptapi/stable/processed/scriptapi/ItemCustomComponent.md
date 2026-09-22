> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.680Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# ItemCustomComponent (interface)

```ts
export interface ItemCustomComponent {
```

Contains a set of events that will be raised for an item.
This object must be bound using the ItemComponentRegistry.

## Members（7）

### `onBeforeDurabilityDamage`
```ts
onBeforeDurabilityDamage?: (
  arg0: ItemComponentBeforeDurabilityDamageEvent,
  arg1: CustomComponentParameters,
) => void;
```

@remarks
This function will be called when an item containing this
component is hitting an entity and about to take durability
damage.

/

### `onCompleteUse`
```ts
onCompleteUse?: (arg0: ItemComponentCompleteUseEvent, arg1: CustomComponentParameters) => void;
```

@remarks
This function will be called when an item containing this
component's use duration was completed.

/

### `onConsume`
```ts
onConsume?: (arg0: ItemComponentConsumeEvent, arg1: CustomComponentParameters) => void;
```

@remarks
This function will be called when an item containing this
component is eaten by an entity.

/

### `onHitEntity`
```ts
onHitEntity?: (arg0: ItemComponentHitEntityEvent, arg1: CustomComponentParameters) => void;
```

@remarks
This function will be called when an item containing this
component is used to hit another entity.

/

### `onMineBlock`
```ts
onMineBlock?: (arg0: ItemComponentMineBlockEvent, arg1: CustomComponentParameters) => void;
```

@remarks
This function will be called when an item containing this
component is used to mine a block.

/

### `onUse`
```ts
onUse?: (arg0: ItemComponentUseEvent, arg1: CustomComponentParameters) => void;
```

@remarks
This function will be called when an item containing this
component is used by a player.

/

### `onUseOn`
```ts
onUseOn?: (arg0: ItemComponentUseOnEvent, arg1: CustomComponentParameters) => void;
```

@remarks
This function will be called when an item containing this
component is used on a block.

/
