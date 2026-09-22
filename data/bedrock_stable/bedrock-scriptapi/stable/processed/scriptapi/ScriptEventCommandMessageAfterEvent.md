> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.541Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# ScriptEventCommandMessageAfterEvent (class)

```ts
export class ScriptEventCommandMessageAfterEvent {
```

Returns additional data about a /scriptevent command
invocation.

## Members（7）

### `private`
```ts
private constructor();
```

### `id`
```ts
readonly id: string;
```

@remarks
Identifier of this ScriptEvent command message.

/

### `initiator`
```ts
readonly initiator?: Entity;
```

@remarks
If this command was initiated via an NPC, returns the entity
that initiated the NPC dialogue.

/

### `message`
```ts
readonly message: string;
```

@remarks
Optional additional data passed in with the script event
command.

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
readonly sourceType: ScriptEventSource;
```

@remarks
Returns the type of source that fired this command.

/
