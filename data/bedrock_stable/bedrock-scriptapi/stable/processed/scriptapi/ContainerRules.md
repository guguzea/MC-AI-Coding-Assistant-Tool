> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.621Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# ContainerRules (interface)

```ts
export interface ContainerRules {
```

Rules that if broken on container operations will throw an
error.

## Members（4）

### `allowedItems`
```ts
allowedItems: string[];
```

@remarks
Defines the items that are exclusively allowed in the
container. If empty all items are allowed in the container.

/

### `allowNestedStorageItems`
```ts
allowNestedStorageItems: boolean;
```

@remarks
Determines whether other storage items can be placed into
the container.

/

### `bannedItems`
```ts
bannedItems: string[];
```

@remarks
Defines the items that are not allowed in the container.

/

### `weightLimit`
```ts
weightLimit?: number;
```

@remarks
Defines the maximum allowed total weight of all items in the
storage item container. If undefined container has no weight
limit.

/
