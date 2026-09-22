# VanillaBrewingRecipe

**Inheritance:** java.lang.Object → net.minecraftforge.common.brewing.VanillaBrewingRecipe

## Class signature

```java
public class VanillaBrewingRecipe extends java.lang.Object implements IBrewingRecipe
```

## Constructors

- `VanillaBrewingRecipe()`

## Methods

- `ItemStack getOutput(ItemStack input, ItemStack ingredient)` — Code copied from TileEntityBrewingStand.brewPotions() It brews the potion by doing the bit-shifting magic and then checking if the new PotionEffect list is different to the old one, or if the new potion is a splash potion when the old one wasn't.
- `boolean isIngredient(ItemStack stack)` — Code adapted from TileEntityBrewingStand.isItemValidForSlot(int index, ItemStack stack)
- `boolean isInput(ItemStack stack)` — Code adapted from TileEntityBrewingStand.isItemValidForSlot(int index, ItemStack stack)