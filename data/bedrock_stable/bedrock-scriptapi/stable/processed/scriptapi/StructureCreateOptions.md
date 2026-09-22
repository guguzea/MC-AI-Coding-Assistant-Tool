> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.705Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# StructureCreateOptions (interface)

```ts
export interface StructureCreateOptions {
```

Provides additional options for {@link
StructureManager.createFromWorld}

## Members（3）

### `includeBlocks`
```ts
includeBlocks?: boolean;
```

@remarks
Whether blocks should be included in the structure. Defaults
to true.

/

### `includeEntities`
```ts
includeEntities?: boolean;
```

@remarks
Whether entities should be included in the structure.
Defaults to true.

/

### `saveMode`
```ts
saveMode?: StructureSaveMode;
```

@remarks
How the Structure should be saved. Defaults to
StructureSaveMode.World.

/
