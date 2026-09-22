> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.538Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# ScoreboardIdentity (class)

```ts
export class ScoreboardIdentity {
```

Contains an identity of the scoreboard item.

## Members（6）

### `private`
```ts
private constructor();
```

### `displayName`
```ts
readonly displayName: string;
```

@remarks
Returns the player-visible name of this identity.

/

### `id`
```ts
readonly id: number;
```

@remarks
Identifier of the scoreboard identity.

/

### `isValid`
```ts
readonly isValid: boolean;
```

@remarks
Returns true if the ScoreboardIdentity reference is still
valid.

/

### `readonly`
```ts
readonly 'type': ScoreboardIdentityType;
```

@remarks
Type of the scoreboard identity.

/

### `getEntity`
```ts
getEntity(): Entity | undefined;
```

@remarks
If the scoreboard identity is an entity or player, returns
the entity that this scoreboard item corresponds to.

@throws This function can throw errors.
/
