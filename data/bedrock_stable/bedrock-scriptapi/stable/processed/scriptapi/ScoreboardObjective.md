> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.539Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# ScoreboardObjective (class)

```ts
export class ScoreboardObjective {
```

Contains objectives and participants for the scoreboard.

## Members（11）

### `private`
```ts
private constructor();
```

### `displayName`
```ts
readonly displayName: string;
```

@remarks
Returns the player-visible name of this scoreboard
objective.

@throws This property can throw when used.
/

### `id`
```ts
readonly id: string;
```

@remarks
Identifier of the scoreboard objective.

@throws This property can throw when used.
/

### `isValid`
```ts
readonly isValid: boolean;
```

@remarks
Returns true if the ScoreboardObjective reference is still
valid.

/

### `addScore`
```ts
addScore(participant: Entity | ScoreboardIdentity | string, scoreToAdd: number): number;
```

@remarks
Adds a score to the given participant and objective.

This function can't be called in restricted-execution mode.

@param participant
Participant to apply the scoreboard value addition to.
@throws This function can throw errors.
/

### `getParticipants`
```ts
getParticipants(): ScoreboardIdentity[];
```

@remarks
Returns all objective participant identities.

@throws This function can throw errors.
/

### `getScore`
```ts
getScore(participant: Entity | ScoreboardIdentity | string): number | undefined;
```

@remarks
Returns a specific score for a participant.

@param participant
Identifier of the participant to retrieve a score for.
@throws This function can throw errors.
/

### `getScores`
```ts
getScores(): ScoreboardScoreInfo[];
```

@remarks
Returns specific scores for this objective for all
participants.

@throws This function can throw errors.
/

### `hasParticipant`
```ts
hasParticipant(participant: Entity | ScoreboardIdentity | string): boolean;
```

@remarks
Returns if the specified identity is a participant of the
scoreboard objective.

@throws This function can throw errors.
/

### `removeParticipant`
```ts
removeParticipant(participant: Entity | ScoreboardIdentity | string): boolean;
```

@remarks
Removes a participant from this scoreboard objective.

This function can't be called in restricted-execution mode.

@param participant
Participant to remove from being tracked with this
objective.
@throws This function can throw errors.
/

### `setScore`
```ts
setScore(participant: Entity | ScoreboardIdentity | string, score: number): void;
```

@remarks
Sets a score for a participant.

This function can't be called in restricted-execution mode.

@param participant
Identity of the participant.
@param score
New value of the score.
@throws This function can throw errors.
/
