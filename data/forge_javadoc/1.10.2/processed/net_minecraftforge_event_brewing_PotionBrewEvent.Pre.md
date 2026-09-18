# PotionBrewEvent.Pre

## Constructors

- `public Pre( ItemStack [] stacks)`

## Description

PotionBrewEvent.Pre is fired before vanilla brewing takes place. All changes made to the event's array will be made to the TileEntity if the event is canceled. The event is fired during the TileEntity