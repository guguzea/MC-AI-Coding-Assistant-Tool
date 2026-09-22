> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.178Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# BlockStateType (class)

```ts
export class BlockStateType {
```

Represents a configurable state value of a block instance.
For example, the facing direction of stairs is accessible as
a block state.

## Members（3）

### `private`
```ts
private constructor();
```

### `id`
```ts
readonly id: string;
```

@remarks
Identifier of the block property.

/

### `validValues`
```ts
readonly validValues: (boolean | number | string)[];
```

@remarks
A set of valid values for the block property.

/
