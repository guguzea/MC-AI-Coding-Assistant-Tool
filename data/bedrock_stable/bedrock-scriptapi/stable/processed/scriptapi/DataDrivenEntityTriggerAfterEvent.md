> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.197Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# DataDrivenEntityTriggerAfterEvent (class)

```ts
export class DataDrivenEntityTriggerAfterEvent {
```

Contains information related to firing of a data driven
entity event - for example, the minecraft:ageable_grow_up
event on a chicken.

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
Entity that the event triggered on.

/

### `eventId`
```ts
readonly eventId: string;
```

@remarks
Name of the data driven event being triggered.

/

### `getModifiers`
```ts
getModifiers(): DefinitionModifier[];
```

@remarks
An updateable list of modifications to component state that
are the effect of this triggered event.

/
