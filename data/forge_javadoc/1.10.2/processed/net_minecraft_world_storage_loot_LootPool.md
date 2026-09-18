# LootPool

## Class signature

```java
public class LootPool extends java.lang.Object
```

## Constructors

- `public LootPool( LootEntry [] lootEntriesIn, LootCondition [] poolConditionsIn, RandomValueRange rollsIn, RandomValueRange bonusRollsIn, java.lang.String name)`

## Methods

- `protected void createLootRoll(java.util.Collection< ItemStack > stacks, java.util.Random rand, LootContext context)`
- `public void generateLoot(java.util.Collection< ItemStack > stacks, java.util.Random rand, LootContext context)`
- `public void freeze()`
- `public boolean isFrozen()`
- `public java.lang.String getName()`
- `public RandomValueRange getRolls()`
- `public RandomValueRange getBonusRolls()`
- `public void setRolls( RandomValueRange v)`
- `public void setBonusRolls( RandomValueRange v)`
- `public LootEntry getEntry(java.lang.String name)`
- `public LootEntry removeEntry(java.lang.String name)`
- `public void addEntry( LootEntry entry)`