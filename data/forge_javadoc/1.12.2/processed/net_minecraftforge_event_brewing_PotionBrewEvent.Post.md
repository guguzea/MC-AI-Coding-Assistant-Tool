# PotionBrewEvent.Post

## Constructors

- `public Post( NonNullList < ItemStack > stacks)`

## Description

PotionBrewEvent.Post is fired when a potion is brewed in the brewing stand. The event is fired during the TileEntityBrewingStand.brewPotions() method invocation. PotionBrewEvent.stacks contains the it