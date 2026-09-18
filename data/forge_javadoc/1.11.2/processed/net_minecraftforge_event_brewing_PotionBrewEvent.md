# PotionBrewEvent

## Class signature

```java
public class PotionBrewEvent extends Event
```

## Constructors

- `protected PotionBrewEvent( NonNullList < ItemStack > stacks)`

## Methods

- `@Nonnull public ItemStack getItem(int index)`
- `public void setItem(int index, @Nonnull ItemStack stack)`
- `public int getLength()`

## Description

PotionBrewEvent.Post is fired when a potion is brewed in the brewing stand.