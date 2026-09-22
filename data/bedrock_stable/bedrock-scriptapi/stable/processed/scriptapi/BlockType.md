> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.179Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# BlockType (class)

```ts
export class BlockType {
```

The type (or template) of a block. Does not contain
permutation data (state) other than the type of block it
represents. This type was introduced as of version
1.17.10.21.

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
Block type name - for example, `minecraft:acacia_stairs`.

/

### `localizationKey`
```ts
readonly localizationKey: string;
```

@remarks
Key for the localization of this BlockType's name used in
.lang files.

/
