> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.339Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityWaypoint (class)

```ts
export class EntityWaypoint extends Waypoint {
```

## Members（3）

### `entity`
```ts
readonly entity: Entity;
```

@remarks
The entity being tracked by this waypoint.

@throws This property can throw when used.

{@link InvalidWaypointError}

{@link InvalidWaypointTextureSelectorError}
/

### `entityRules`
```ts
readonly entityRules: EntityVisibilityRules;
```

@remarks
The visibility rules that control when the waypoint is shown
based on the entity's state (e.g., sneaking, invisible,
dead).

@throws This property can throw when used.

{@link InvalidWaypointError}

{@link InvalidWaypointTextureSelectorError}
/

### `constructor`
```ts
constructor(
  entity: Entity,
  textureSelector: WaypointTextureSelector,
  entityRules: EntityVisibilityRules,
  color?: RGB,
);
```

@throws This function can throw errors.

{@link InvalidWaypointTextureSelectorError}
/
