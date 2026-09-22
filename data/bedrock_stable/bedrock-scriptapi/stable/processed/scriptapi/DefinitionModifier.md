> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.627Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# DefinitionModifier (interface)

```ts
export interface DefinitionModifier {
```

Contains a set of updates to the component definition state
of an entity.

## Members（2）

### `addedComponentGroups`
```ts
addedComponentGroups: string[];
```

@remarks
Retrieves the list of component groups that will be added
via this definition modification.

/

### `removedComponentGroups`
```ts
removedComponentGroups: string[];
```

@remarks
The list of component groups that will be removed via this
definition modification.

/
