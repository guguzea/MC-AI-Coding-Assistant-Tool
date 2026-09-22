# EntityHasScore

**Inheritance:** java.lang.Object → net.minecraft.world.storage.loot.conditions.EntityHasScore

## Class signature

```java
public class EntityHasScore extends java.lang.Object implements LootCondition
```

## Constructors

- `EntityHasScore(java.util.Map<java.lang.String, RandomValueRange> scoreIn, LootContext.EntityTarget targetIn)`

## Methods

- `protected boolean entityScoreMatch(Entity entityIn, Scoreboard scoreboardIn, java.lang.String objectiveStr, RandomValueRange rand)`
- `boolean testCondition(java.util.Random rand, LootContext context)`