> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.335Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityUpgradeAfterEvent (class)

```ts
export class EntityUpgradeAfterEvent {
```

Contains information related to firing of a data driven
entity version upgrade.

## Members（4）

### `private`
```ts
private constructor();
```

### `entity`
```ts
readonly entity: Entity;
```

@remarks
Entity that the upgrade triggered on.

/

### `upgradeId`
```ts
readonly upgradeId: string;
```

@remarks
Name of the data driven upgrade being triggered.

/

### `getModifiers`
```ts
getModifiers(): DefinitionModifier[];
```

@remarks
An updateable list of modifications to component state that
are the effect of this triggered upgrade.

/
