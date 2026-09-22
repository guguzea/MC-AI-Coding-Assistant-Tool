> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.602Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# BlockFilter (interface)

```ts
export interface BlockFilter {
```

Options to include or exclude blocks based on type, tag or
permutation. If no include options are added it will select
all blocks that are not rejected by the exclude options. If
at least one include option is added the block must match
one of the include options to not be rejected.

## Members（6）

### `excludePermutations`
```ts
excludePermutations?: BlockPermutation[];
```

@remarks
Array of block permutations that the filter should reject if
any matches.

/

### `excludeTags`
```ts
excludeTags?: string[];
```

@remarks
Array of block tags that the filter should reject if any
matches.

/

### `excludeTypes`
```ts
excludeTypes?: string[];
```

@remarks
Array of block types that the filter should reject if any
matches.

/

### `includePermutations`
```ts
includePermutations?: BlockPermutation[];
```

@remarks
Array of block permutations that the filter should select if
at least one matches.

/

### `includeTags`
```ts
includeTags?: string[];
```

@remarks
Array of block tags that the filter should select if at
least one matches.

/

### `includeTypes`
```ts
includeTypes?: string[];
```

@remarks
Array of block types that the filter should select if at
least one matches.

/
