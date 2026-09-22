> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.139Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# BiomeTypes (class)

```ts
export class BiomeTypes {
```

Supports a catalog of available biome types registered
within Minecraft.

## Members（3）

### `private`
```ts
private constructor();
```

### `get`
```ts
static get(typeName: string): BiomeType | undefined;
```

@remarks
Returns a specific biome type.

@param typeName
Identifier of the biome.  Generally, namespaced identifiers
(e.g., minecraft:frozen_peaks) should be used.
@returns
If the biome exists, a BiomeType object is returned. If not,
undefined is returned.
/

### `getAll`
```ts
static getAll(): BiomeType[];
```

@remarks
Returns all registered biome types within Minecraft

/
