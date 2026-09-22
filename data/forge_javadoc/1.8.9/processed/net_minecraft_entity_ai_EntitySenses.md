# EntitySenses

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntitySenses

## Class signature

```java
public class EntitySenses extends java.lang.Object
```

## Constructors

- `EntitySenses(EntityLiving entityObjIn)`

## Methods

- `boolean canSee(Entity entityIn)` — Checks, whether 'our' entity can see the entity given as argument (true) or not (false), caching the result.
- `void clearSensingCache()` — Clears canSeeCachePositive and canSeeCacheNegative.