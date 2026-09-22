> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.635Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityDamageSource (interface)

```ts
export interface EntityDamageSource {
```

Provides information about how damage has been applied to an
entity.

## Members（3）

### `cause`
```ts
cause: EntityDamageCause;
```

@remarks
Cause enumeration of damage.

/

### `damagingEntity`
```ts
damagingEntity?: Entity;
```

@remarks
Optional entity that caused the damage.

/

### `damagingProjectile`
```ts
damagingProjectile?: Entity;
```

@remarks
Optional projectile that may have caused damage.

/
