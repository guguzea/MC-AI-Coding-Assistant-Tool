# ItemPredicate

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.ItemPredicate

## Class signature

```java
public class ItemPredicate extends java.lang.Object
```

## Constructors

- `ItemPredicate()`
- `ItemPredicate(Item item, java.lang.Integer data, MinMaxBounds count, MinMaxBounds durability, EnchantmentPredicate [] enchantments, PotionType potion, NBTPredicate nbt)`

## Methods

- `static ItemPredicate deserialize(JsonElement element)`
- `static ItemPredicate [] deserializeArray(JsonElement element)`
- `boolean test(ItemStack item)`

## Fields

- `static ItemPredicate ANY`