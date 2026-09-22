> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.679Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# InventoryItemEventOptions (interface)

```ts
export interface InventoryItemEventOptions {
```

Contains additional filtering options for inventory item
events.

## Members（7）

### `allowedSlots`
```ts
allowedSlots?: number[];
```

@remarks
The slot indexes to consider. Values should be positive
numbers. If not specified, all slots are considered.

Bounds: [0, 1000]
/

### `excludeItems`
```ts
excludeItems?: string[];
```

@remarks
The names for the items to exclude.

/

### `excludeTags`
```ts
excludeTags?: string[];
```

@remarks
The item tags to exclude.

/

### `ignoreQuantityChange`
```ts
ignoreQuantityChange?: boolean;
```

@remarks
Flag to specify to ignore quantity changes only. True to
ignore quantity changes, false to not ignore quantity
changes.

/

### `includeItems`
```ts
includeItems?: string[];
```

@remarks
The item names to consider.

/

### `includeTags`
```ts
includeTags?: string[];
```

@remarks
The item tags to consider.

/

### `inventoryType`
```ts
inventoryType?: PlayerInventoryType;
```

@remarks
The player inventory type to consider.

/
