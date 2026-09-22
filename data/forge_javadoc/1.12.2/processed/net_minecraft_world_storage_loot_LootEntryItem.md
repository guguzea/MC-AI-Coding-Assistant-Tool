# LootEntryItem

**Inheritance:** java.lang.Object → net.minecraft.world.storage.loot.LootEntry → net.minecraft.world.storage.loot.LootEntryItem

## Class signature

```java
public class LootEntryItem extends LootEntry
```

## Constructors

- `LootEntryItem(Item itemIn, int weightIn, int qualityIn, LootFunction [] functionsIn, LootCondition [] conditionsIn, java.lang.String entryName)`

## Methods

- `void addLoot(java.util.Collection<ItemStack> stacks, java.util.Random rand, LootContext context)`
- `static LootEntryItem deserialize(JsonObject object, JsonDeserializationContext deserializationContext, int weightIn, int qualityIn, LootCondition [] conditionsIn)`
- `protected void serialize(JsonObject json, JsonSerializationContext context)`

## Fields

- `protected LootFunction [] functions`
- `protected Item item`