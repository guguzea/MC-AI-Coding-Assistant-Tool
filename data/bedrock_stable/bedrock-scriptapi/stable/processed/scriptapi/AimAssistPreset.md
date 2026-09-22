> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.135Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# AimAssistPreset (class)

```ts
export class AimAssistPreset {
```

Handle to an aim-assist preset that exists in the
world.aimAssist registry.

## Members（10）

### `private`
```ts
private constructor();
```

### `defaultItemSettings`
```ts
readonly defaultItemSettings?: string;
```

@remarks
Optional. Default aim-assist category Id used for items not
provided to setItemSettings.

@throws This property can throw when used.
/

### `handSettings`
```ts
readonly handSettings?: string;
```

@remarks
Optional. Aim-assist category Id used for an empty hand.

@throws This property can throw when used.
/

### `identifier`
```ts
readonly identifier: string;
```

@remarks
The unique Id associated with the preset.

/

### `getExcludedBlockTagTargets`
```ts
getExcludedBlockTagTargets(): string[];
```

@remarks
Gets the list of block tags to exclude from aim assist
targeting.

@returns
The array of block tags.
@throws This function can throw errors.

{@link minecraftcommon.EngineError}
/

### `getExcludedBlockTargets`
```ts
getExcludedBlockTargets(): string[];
```

@remarks
Gets the list of block Ids to exclude from aim assist
targeting.

@returns
The array of block Ids.
@throws This function can throw errors.
/

### `getExcludedEntityTargets`
```ts
getExcludedEntityTargets(): string[];
```

@remarks
Gets the list of entity Ids to exclude from aim assist
targeting.

@returns
The array of entity Ids.
@throws This function can throw errors.
/

### `getExcludedEntityTypeFamilyTargets`
```ts
getExcludedEntityTypeFamilyTargets(): string[];
```

@remarks
Gets the list of entity type families to exclude from aim
assist targeting.

@returns
The array of entity type families.
@throws This function can throw errors.

{@link minecraftcommon.EngineError}
/

### `getItemSettings`
```ts
getItemSettings(): Record<string, string>;
```

@remarks
Gets the per-item aim-assist category Ids.

@returns
The record mapping item Ids to aim-assist category Ids.
@throws This function can throw errors.
/

### `getLiquidTargetingItems`
```ts
getLiquidTargetingItems(): string[];
```

@remarks
Gets the list of item Ids that will target liquid blocks
with aim-assist when being held.

@returns
The array of item Ids.
@throws This function can throw errors.
/
