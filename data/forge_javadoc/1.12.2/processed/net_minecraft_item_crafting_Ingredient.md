# Ingredient

## Class signature

```java
public class Ingredient extends java.lang.Object
```

## Constructors

- `protected Ingredient(int size)`
- `protected Ingredient( ItemStack ... p_i47503_1_)`

## Methods

- `public ItemStack [] getMatchingStacks()`
- `public boolean apply( ItemStack p_apply_1_)`
- `public IntList getValidItemStacksPacked()`
- `public static void invalidateAll()`
- `protected void invalidate()`
- `public static Ingredient fromItem( Item p_193367_0_)`
- `public static Ingredient fromItems( Item ... items)`
- `public static Ingredient fromStacks( ItemStack ... stacks)`
- `public static Ingredient merge(java.util.Collection< Ingredient > parts)`
- `public boolean isSimple()`