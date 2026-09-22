> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.180Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# BlockTypes (class)

```ts
export class BlockTypes {
```

Contains a catalog of Minecraft Block Types that are
available in this world.

## Members（3）

### `private`
```ts
private constructor();
```

### `get`
```ts
static get(typeName: string): BlockType | undefined;
```

@remarks
Returns a BlockType object for the specified identifier.

@param typeName
Identifier of the block type. Should follow a namespace:id
pattern, such as minecraft:dirt.
@returns
BlockType object, or undefined if the block type is not
available within this world.
/

### `getAll`
```ts
static getAll(): BlockType[];
```

@remarks
Returns a collection of all available block types.

/
