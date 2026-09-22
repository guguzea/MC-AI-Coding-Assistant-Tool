> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.681Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# JigsawPlaceOptions (interface)

```ts
export interface JigsawPlaceOptions {
```

Provides additional options for {@link
StructureManager.placeJigsaw}.

## Members（3）

### `includeEntities`
```ts
includeEntities?: boolean;
```

@remarks
Whether entities should be included in the structure.
Defaults to true.

/

### `keepJigsaws`
```ts
keepJigsaws?: boolean;
```

@remarks
Whether the jigsaw blocks should be kept when generating the
structure. Defaults to false.

/

### `liquidSettings`
```ts
liquidSettings?: LiquidSettings;
```

@remarks
Specifies how to handle waterloggable blocks overlapping
with existing liquid. Defaults to `ApplyWaterlogging`.

/
