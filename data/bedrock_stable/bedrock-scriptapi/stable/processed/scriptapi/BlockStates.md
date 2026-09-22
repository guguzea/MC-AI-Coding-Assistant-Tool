> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.177Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# BlockStates (class)

```ts
export class BlockStates {
```

Enumerates all {@link BlockStateType}s.

## Members（3）

### `private`
```ts
private constructor();
```

### `get`
```ts
static get(stateName: string): BlockStateType | undefined;
```

@remarks
Retrieves a specific block state instance.

@returns
Returns the {@link Block} state instance if it is found. If
the block state instance is not found returns undefined.
/

### `getAll`
```ts
static getAll(): BlockStateType[];
```

@remarks
Retrieves a set of all available block states.

/
