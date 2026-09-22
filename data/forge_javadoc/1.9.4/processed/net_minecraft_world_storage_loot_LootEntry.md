# LootEntry

**Inheritance:** java.lang.Object → net.minecraft.world.storage.loot.LootEntry

## Class signature

```java
public abstract class LootEntry extends java.lang.Object
```

## Constructors

- `LootEntry(int weightIn, int qualityIn, LootCondition [] conditionsIn, java.lang.String entryName)`

## Methods

- `abstract void addLoot(java.util.Collection<ItemStack> stacks, java.util.Random rand, LootContext context)`
- `int getEffectiveWeight(float luck)`
- `java.lang.String getEntryName()`
- `protected abstract void serialize(com.google.gson.JsonObject json, com.google.gson.JsonSerializationContext context)`

## Fields

- `protected LootCondition [] conditions`
- `protected java.lang.String entryName`
- `protected int quality`
- `protected int weight`