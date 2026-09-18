# CompoundIngredient

## Class signature

```java
public class CompoundIngredient extends Ingredient
```

## Constructors

- `protected CompoundIngredient(java.util.Collection< Ingredient > children)`

## Methods

- `public ItemStack [] getMatchingStacks()`
- `public IntList getValidItemStacksPacked()`
- `public boolean apply( ItemStack target)`
- `protected void invalidate()`
- `public boolean isSimple()`
- `public java.util.Collection< Ingredient > getChildren()`