> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.427Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# LootTableManager (class)

```ts
export class LootTableManager {
```

Manager for Loot Table related APIs. Allows for generation
of drops from blocks and entities according to their loot
tables.

## Members（8）

### `private`
```ts
private constructor();
```

### `generateLootFromBlock`
```ts
generateLootFromBlock(block: Block, tool?: ItemStack): ItemStack[] | undefined;
```

@remarks
Generates loot from a given block as if it had been mined.

@param block
The block to generate loot from.
@param tool
Optional. The tool to use in the looting operation.
@returns
An array of item stacks dropped from the loot drop event.
Can be empty if no loot dropped, or undefined if the
provided tool is insufficient to mine the block.
@throws
Throws if the block is in an unloaded chunk, or if the
block's position is outside of world bounds.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}

{@link UnloadedChunksError}
/

### `generateLootFromBlockPermutation`
```ts
generateLootFromBlockPermutation(blockPermutation: BlockPermutation, tool?: ItemStack): ItemStack[] | undefined;
```

@remarks
Generates loot from a given block permutation as if it had
been mined.

@param tool
Optional. The tool to use in the looting operation.
@returns
An array of item stacks dropped from the loot drop event.
Can be empty if no loot dropped, or undefined if the
provided tool is insufficient to mine the block.
/

### `generateLootFromBlockType`
```ts
generateLootFromBlockType(scriptBlockType: BlockType, tool?: ItemStack): ItemStack[] | undefined;
```

@remarks
Generates loot from a given block type as if it had been
mined.

@param tool
Optional. The tool to use in the looting operation.
@returns
An array of item stacks dropped from the loot drop event.
Can be empty if no loot dropped, or undefined if the
provided tool is insufficient to mine the block.
/

### `generateLootFromEntity`
```ts
generateLootFromEntity(entity: Entity, tool?: ItemStack): ItemStack[] | undefined;
```

@remarks
Generates loot from given a entity as if it had been killed.

@param tool
Optional. The tool to use in the looting operation.
@returns
An array of item stacks dropped from the loot drop event.
Can be empty if no loot dropped, or undefined if the entity
was invalid.
@throws This function can throw errors.

{@link InvalidEntityError}
/

### `generateLootFromEntityType`
```ts
generateLootFromEntityType(entityType: EntityType, tool?: ItemStack): ItemStack[] | undefined;
```

@remarks
Generates loot from given a entity type as if it had been
killed.

@param tool
Optional. The tool to use in the looting operation.
@returns
An array of item stacks dropped from the loot drop event.
Can be empty if no loot dropped.
/

### `generateLootFromTable`
```ts
generateLootFromTable(lootTable: LootTable, tool?: ItemStack): ItemStack[] | undefined;
```

@remarks
Generates loot from a given LootTable.

@param tool
Optional. The tool to use in the looting operation.
@returns
An array of item stacks dropped from the loot drop event.
Can be empty if no loot dropped, or undefined if the
provided tool is insufficient to mine the block.
/

### `getLootTable`
```ts
getLootTable(path: string): LootTable | undefined;
```

@remarks
Retrieves a single loot table from the level's current
registry.

@param path
Path to the table to retrieve. Does not include file
extension, or 'loot_tables/' folder prefix. Example:
`entities/creeper`.
@returns
Returns a LootTable if one is found, or `undefined` if the
provided path does not correspond to an existing loot table.
/
