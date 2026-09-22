> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.134Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# AimAssistCategorySettings (class)

```ts
export class AimAssistCategorySettings {
```

Settings used with AimAssistRegistry.addCategory for
creation of the AimAssistCategory.

## Members（12）

### `defaultBlockPriority`
```ts
defaultBlockPriority: number;
```

@remarks
Optional. Default targeting priority used for block types
not provided to setBlockPriorities.

This property can't be edited in restricted-execution mode.

/

### `defaultEntityPriority`
```ts
defaultEntityPriority: number;
```

@remarks
Optional. Default targeting priority used for entity types
not provided to setEntityPriorities.

This property can't be edited in restricted-execution mode.

/

### `identifier`
```ts
readonly identifier: string;
```

@remarks
The unique Id used to register the category with. Must have
a namespace.

/

### `constructor`
```ts
constructor(identifier: string);
```

@remarks
Constructor that takes a unique Id to associate with the
created AimAssistCategory. Must have a namespace.

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
/

### `setBlockPriorities`
```ts
setBlockPriorities(blockPriorities: Record<string, number>): void;
```

@remarks
Sets the priority settings used for block targeting.

This function can't be called in restricted-execution mode.

@param blockPriorities
A record mapping block Ids to their priority settings.
Larger numbers have greater priority.
/

### `setBlockTagPriorities`
```ts
setBlockTagPriorities(blockTagPriorities: Record<string, number>): void;
```

@remarks
Sets the priority settings used for block targeting.

This function can't be called in restricted-execution mode.

/

### `setEntityPriorities`
```ts
setEntityPriorities(entityPriorities: Record<string, number>): void;
```

@remarks
Sets the priority settings used for entity targeting.

This function can't be called in restricted-execution mode.

@param entityPriorities
A record mapping entity Ids to their priority settings.
Larger numbers have greater priority.
/

### `setEntityTypeFamilyPriorities`
```ts
setEntityTypeFamilyPriorities(entityTypeFamilyPriorities: Record<string, number>): void;
```

@remarks
Sets the priority settings used for entity targeting.

This function can't be called in restricted-execution mode.

/
