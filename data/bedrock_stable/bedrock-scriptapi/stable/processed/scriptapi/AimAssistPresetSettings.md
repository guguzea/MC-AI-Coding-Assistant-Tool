> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.136Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# AimAssistPresetSettings (class)

```ts
export class AimAssistPresetSettings {
```

Settings used with AimAssistRegistry.addPreset for creation
of the AimAssistPreset.

## Members（16）

### `defaultItemSettings`
```ts
defaultItemSettings?: string;
```

@remarks
Optional. Default aim-assist category Id used for items not
provided to setItemSettings.

This property can't be edited in restricted-execution mode.

/

### `handSettings`
```ts
handSettings?: string;
```

@remarks
Optional. Aim-assist category Id used for an empty hand.

This property can't be edited in restricted-execution mode.

/

### `identifier`
```ts
readonly identifier: string;
```

@remarks
The unique Id used to register the preset with. Must have a
namespace.

/

### `constructor`
```ts
constructor(identifier: string);
```

@remarks
Constructor that takes a unique Id to associate with the
created AimAssistPreset. Must have a namespace.

/

### `getExcludedBlockTagTargets`
```ts
getExcludedBlockTagTargets(): string[] | undefined;
```

@remarks
Gets the list of block tags to exclude from aim assist
targeting.

@returns
The array of block tags.
/

### `getExcludedBlockTargets`
```ts
getExcludedBlockTargets(): string[] | undefined;
```

@remarks
Gets the list of block Ids to exclude from aim assist
targeting.

@returns
The array of block Ids.
/

### `getExcludedEntityTargets`
```ts
getExcludedEntityTargets(): string[] | undefined;
```

@remarks
Gets the list of entity Ids to exclude from aim assist
targeting.

@returns
The array of entity Ids.
/

### `getExcludedEntityTypeFamilyTargets`
```ts
getExcludedEntityTypeFamilyTargets(): string[] | undefined;
```

@remarks
Gets the list of entity type families to exclude from aim
assist targeting.

@returns
The array of entity type families.
/

### `getItemSettings`
```ts
getItemSettings(): Record<string, string>;
```

@remarks
Gets the per-item aim-assist category Ids.

@returns
The record mapping item Ids to aim-assist category Ids.
/

### `getLiquidTargetingItems`
```ts
getLiquidTargetingItems(): string[] | undefined;
```

@remarks
Gets the list of item Ids that will target liquid blocks
with aim-assist when being held.

@returns
The array of item Ids.
/

### `setExcludedBlockTagTargets`
```ts
setExcludedBlockTagTargets(blockTagTargets?: string[]): void;
```

@remarks
Sets the list of block tags to exclude from aim assist
targeting.

This function can't be called in restricted-execution mode.

/

### `setExcludedBlockTargets`
```ts
setExcludedBlockTargets(blockTargets?: string[]): void;
```

@remarks
Sets the list of block Ids to exclude from aim assist
targeting.

This function can't be called in restricted-execution mode.

/

### `setExcludedEntityTargets`
```ts
setExcludedEntityTargets(entityTargets?: string[]): void;
```

@remarks
Sets the list of entity Ids to exclude from aim assist
targeting.

This function can't be called in restricted-execution mode.

/

### `setExcludedEntityTypeFamilyTargets`
```ts
setExcludedEntityTypeFamilyTargets(entityTypeFamilyTargets?: string[]): void;
```

@remarks
Sets the list of entity type families to exclude from aim
assist targeting.

This function can't be called in restricted-execution mode.

/

### `setItemSettings`
```ts
setItemSettings(itemSettings: Record<string, string>): void;
```

@remarks
Sets the per-item aim-assist category Ids.

This function can't be called in restricted-execution mode.

@param itemSettings
A record mapping item Ids to aim-assist category Ids.
Category Ids must have a namespace.
/

### `setLiquidTargetingItems`
```ts
setLiquidTargetingItems(items?: string[]): void;
```

@remarks
Sets the list of item Ids that will target liquid blocks
with aim-assist when being held.

This function can't be called in restricted-execution mode.

@param items
An array of item Ids.
/
