# AnvilUpdateEvent

## Class signature

```java
public class AnvilUpdateEvent extends Event
```

## Constructors

- `public AnvilUpdateEvent(@Nonnull ItemStack left, @Nonnull ItemStack right, java.lang.String name, int cost)`

## Methods

- `@Nonnull public ItemStack getLeft()`
- `@Nonnull public ItemStack getRight()`
- `public java.lang.String getName()`
- `@Nonnull public ItemStack getOutput()`
- `public void setOutput(@Nonnull ItemStack output)`
- `public int getCost()`
- `public void setCost(int cost)`
- `public int getMaterialCost()`
- `public void setMaterialCost(int materialCost)`

## Description

AnvilUpdateEvent is fired when a player places items in both the left and right slots of a anvil. If the event is canceled, vanilla behavior will not run, and the output will be set to null. If the ev