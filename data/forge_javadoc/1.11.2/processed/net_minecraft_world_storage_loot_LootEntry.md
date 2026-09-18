# LootEntry

## Class signature

```java
public abstract class LootEntry extends java.lang.Object
```

## Constructors

- `protected LootEntry(int weightIn, int qualityIn, LootCondition [] conditionsIn, java.lang.String entryName)`

## Methods

- `public int getEffectiveWeight(float luck)`
- `public java.lang.String getEntryName()`
- `public abstract void addLoot(java.util.Collection< ItemStack > stacks, java.util.Random rand, LootContext context)`
- `protected abstract void serialize(com.google.gson.JsonObject json, com.google.gson.JsonSerializationContext context)`