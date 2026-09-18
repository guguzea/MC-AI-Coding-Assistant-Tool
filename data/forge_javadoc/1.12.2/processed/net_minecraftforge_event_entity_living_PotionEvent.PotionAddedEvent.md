# PotionEvent.PotionAddedEvent

## Constructors

- `public PotionAddedEvent( EntityLivingBase living, PotionEffect oldEffect, PotionEffect newEffect)`

## Methods

- `public PotionEffect getPotionEffect()`
- `public PotionEffect getOldPotionEffect()`

## Description

This Event is fired when a new Potion is added to the Entity. This is also fired if the Entity already has this effect but with different duration/level. This Event is not Cancelable This Event does n