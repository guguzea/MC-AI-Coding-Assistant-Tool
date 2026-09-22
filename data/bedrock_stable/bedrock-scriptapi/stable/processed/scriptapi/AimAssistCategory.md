> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.133Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# AimAssistCategory (class)

```ts
export class AimAssistCategory {
```

Handle to an aim-assist category that exists in the
world.aimAssist registry.

## Members（8）

### `private`
```ts
private constructor();
```

### `defaultBlockPriority`
```ts
readonly defaultBlockPriority: number;
```

@remarks
Default targeting priority used for block types not found in
getBlockPriorities.

@throws This property can throw when used.
/

### `defaultEntityPriority`
```ts
readonly defaultEntityPriority: number;
```

@remarks
Default targeting priority used for entity types not found
in getEntityPriorities.

@throws This property can throw when used.
/

### `identifier`
```ts
readonly identifier: string;
```

@remarks
The unique Id associated with the category.

/

### `getBlockPriorities`
```ts
getBlockPriorities(): Record<string, number>;
```

@remarks
Gets the priority settings used for block targeting.

@returns
The record mapping block Ids to their priority settings.
Larger numbers have greater priority.
@throws This function can throw errors.
/

### `getBlockTagPriorities`
```ts
getBlockTagPriorities(): Record<string, number>;
```

@remarks
Gets the priority settings used for block targeting.

@returns
The record mapping block tags to their priority settings.
Larger numbers have greater priority.
@throws This function can throw errors.

{@link minecraftcommon.EngineError}
/

### `getEntityPriorities`
```ts
getEntityPriorities(): Record<string, number>;
```

@remarks
Gets the priority settings used for entity targeting.

@returns
The record mapping entity Ids to their priority settings.
Larger numbers have greater priority.
@throws This function can throw errors.
/

### `getEntityTypeFamilyPriorities`
```ts
getEntityTypeFamilyPriorities(): Record<string, number>;
```

@remarks
Gets the priority settings used for entity targeting.

@returns
Map entity type families to their priority settings in a
Record. Larger numbers have greater priority.
@throws This function can throw errors.

{@link minecraftcommon.EngineError}
/
