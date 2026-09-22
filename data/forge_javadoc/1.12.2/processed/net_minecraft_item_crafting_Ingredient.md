# Ingredient

**Inheritance:** java.lang.Object → net.minecraft.item.crafting.Ingredient

## Class signature

```java
public class Ingredient extends java.lang.Object
```

## Constructors

- `Ingredient(int size)`
- `Ingredient(ItemStack ... p_i47503_1_)`

## Methods

- `boolean apply(ItemStack p_apply_1_)`
- `static Ingredient fromItem(Item p_193367_0_)`
- `static Ingredient fromItems(Item ... items)`
- `static Ingredient fromStacks(ItemStack ... stacks)`
- `ItemStack [] getMatchingStacks()`
- `IntList getValidItemStacksPacked()`
- `protected void invalidate()`
- `static void invalidateAll()`
- `boolean isSimple()`
- `static Ingredient merge(java.util.Collection<Ingredient> parts)`

## Fields

- `static Ingredient EMPTY`