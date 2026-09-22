> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.706Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# StructurePlaceOptions (interface)

```ts
export interface StructurePlaceOptions {
```

Provides additional options for {@link
StructureManager.place}

## Members（9）

### `animationMode`
```ts
animationMode?: StructureAnimationMode;
```

@remarks
How the Structure should be animated when placed.

/

### `animationSeconds`
```ts
animationSeconds?: number;
```

@remarks
How many seconds the animation should take.

/

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

### `integrity`
```ts
integrity?: number;
```

@remarks
What percentage of blocks should be placed. A value of 1
will place 100% of the blocks while a value of 0 will place
none. The blocks are chosen randomly based on the {@link
StructurePlaceOptions.integritySeed}.

/

### `integritySeed`
```ts
integritySeed?: string;
```

@remarks
Seed that determines which blocks are randomly chosen to be
placed. Defaults to a random seed.

/

### `mirror`
```ts
mirror?: StructureMirrorAxis;
```

@remarks
Which axes the Structure should be mirrored on when placed.
Defaults to StructureMirrorAxis.None.

/

### `rotation`
```ts
rotation?: StructureRotation;
```

@remarks
How the Structure should be rotated when placed. Defaults to
AxisAlignedRotation.None.

/

### `waterlogged`
```ts
waterlogged?: boolean;
```

@remarks
Whether the structure should be waterlogged when placed.
Defaults to false. If true, blocks will become waterlogged
when placed in water.

/
