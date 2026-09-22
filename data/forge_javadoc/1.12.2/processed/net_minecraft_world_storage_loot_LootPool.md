# LootPool

**Inheritance:** java.lang.Object → net.minecraft.world.storage.loot.LootPool

## Class signature

```java
public class LootPool extends java.lang.Object
```

## Constructors

- `LootPool(LootEntry [] lootEntriesIn, LootCondition [] poolConditionsIn, RandomValueRange rollsIn, RandomValueRange bonusRollsIn, java.lang.String name)`

## Methods

- `void addEntry(LootEntry entry)`
- `protected void createLootRoll(java.util.Collection<ItemStack> stacks, java.util.Random rand, LootContext context)`
- `void freeze()`
- `void generateLoot(java.util.Collection<ItemStack> stacks, java.util.Random rand, LootContext context)`
- `RandomValueRange getBonusRolls()`
- `LootEntry getEntry(java.lang.String name)`
- `java.lang.String getName()`
- `RandomValueRange getRolls()`
- `boolean isFrozen()`
- `LootEntry removeEntry(java.lang.String name)`
- `void setBonusRolls(RandomValueRange v)`
- `void setRolls(RandomValueRange v)`