# PotionEvent.PotionRemoveEvent

## Constructors

- `public PotionRemoveEvent( EntityLivingBase living, Potion potion)`
- `public PotionRemoveEvent( EntityLivingBase living, PotionEffect effect)`

## Methods

- `public Potion getPotion()`
- `public PotionEffect getPotionEffect()`

## Description

This Event is fired when a Potion is about to get removed from an Entity. This Event is Cancelable . This Event does not have a result.