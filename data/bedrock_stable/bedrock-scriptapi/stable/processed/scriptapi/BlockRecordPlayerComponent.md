> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.174Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# BlockRecordPlayerComponent (class)

```ts
export class BlockRecordPlayerComponent extends BlockComponent {
```

## Members（7）

### `private`
```ts
private constructor();
static readonly componentId = 'minecraft:record_player';
```

### `ejectRecord`
```ts
ejectRecord(): void;
```

@remarks
Ejects the currently set record of this record-playing
block.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.
/

### `getRecord`
```ts
getRecord(): ItemStack | undefined;
```

@remarks
Gets the currently set record of this record-playing block.

@throws This function can throw errors.
/

### `isPlaying`
```ts
isPlaying(): boolean;
```

@remarks
Returns true if the record-playing block is currently
playing a record.

@throws This function can throw errors.
/

### `pauseRecord`
```ts
pauseRecord(): void;
```

@remarks
Pauses the currently playing record of this record-playing
block.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.
/

### `playRecord`
```ts
playRecord(): void;
```

@remarks
Plays the currently set record of this record-playing block.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.
/

### `setRecord`
```ts
setRecord(recordItemType?: ItemType | string, startPlaying?: boolean): void;
```

@remarks
Sets and plays a record based on an item type.

This function can't be called in restricted-execution mode.

@param startPlaying
Defaults to: true
@throws This function can throw errors.
/
