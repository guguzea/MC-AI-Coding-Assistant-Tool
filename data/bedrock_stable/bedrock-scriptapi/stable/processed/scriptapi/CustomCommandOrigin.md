> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.193Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# CustomCommandOrigin (class)

```ts
export class CustomCommandOrigin {
```

Details about the origins of the command.

## Members（5）

### `private`
```ts
private constructor();
```

### `initiator`
```ts
readonly initiator?: Entity;
```

@remarks
If this command was initiated via an NPC, returns the entity
that initiated the NPC dialogue.

/

### `sourceBlock`
```ts
readonly sourceBlock?: Block;
```

@remarks
Source block if this command was triggered via a block
(e.g., a commandblock.)

/

### `sourceEntity`
```ts
readonly sourceEntity?: Entity;
```

@remarks
Source entity if this command was triggered by an entity
(e.g., a NPC).

/

### `sourceType`
```ts
readonly sourceType: CustomCommandSource;
```

@remarks
Returns the type of source that fired this command.

/
