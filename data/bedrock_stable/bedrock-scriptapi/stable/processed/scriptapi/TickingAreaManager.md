> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.574Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# TickingAreaManager (class)

```ts
export class TickingAreaManager {
```

This manager is used to add, remove or query temporary
ticking areas to a dimension. These ticking areas are
limited by a fixed amount of ticking chunks per pack
independent of the command limits. Cannot modify or query
ticking areas added by other packs or commands.

## Members（10）

### `private`
```ts
private constructor();
```

### `chunkCount`
```ts
readonly chunkCount: number;
```

@remarks
The number of currently ticking chunks in this manager.

/

### `maxChunkCount`
```ts
readonly maxChunkCount: number;
```

@remarks
The maximum number of allowed ticking chunks. Overlapping
ticking area chunks do count towards total.

/

### `createTickingArea`
```ts
createTickingArea(identifier: string, options: TickingAreaOptions): Promise<void>;
```

@remarks
Creates a ticking area. Promise will return when all the
chunks in the area are loaded and ticking.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.

{@link minecraftcommon.EngineError}

{@link TickingAreaError}
/

### `getAllTickingAreas`
```ts
getAllTickingAreas(): TickingArea[];
```

@remarks
Gets all ticking areas added by this manager.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.

{@link minecraftcommon.EngineError}
/

### `getTickingArea`
```ts
getTickingArea(identifier: string | TickingArea): TickingArea | undefined;
```

@remarks
Tries to get specific ticking area by identifier.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.

{@link minecraftcommon.EngineError}
/

### `hasCapacity`
```ts
hasCapacity(options: TickingAreaOptions): boolean;
```

@remarks
Returns true if the manager has enough chunk capacity for
the ticking area and false otherwise. Will also return false
if the length or width exceeds the 255 chunk limit.

This function can't be called in restricted-execution mode.

/

### `hasTickingArea`
```ts
hasTickingArea(identifier: string): boolean;
```

@remarks
Returns true if the identifier is already in the manager and
false otherwise.

This function can't be called in restricted-execution mode.

/

### `removeAllTickingAreas`
```ts
removeAllTickingAreas(): void;
```

@remarks
Removes all ticking areas added by this manager.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.

{@link minecraftcommon.EngineError}
/

### `removeTickingArea`
```ts
removeTickingArea(identifier: string | TickingArea): void;
```

@remarks
Removes specific ticking area by unique identifier.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.

{@link minecraftcommon.EngineError}

{@link TickingAreaError}
/
