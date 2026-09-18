# PotionEvent.PotionApplicableEvent

## Constructors

- `public PotionApplicableEvent( EntityLivingBase living, PotionEffect effect)`

## Methods

- `public PotionEffect getPotionEffect()`

## Description

This Event is fired to check if a Potion can get applied to an Entity. This Event is not Cancelable This Event has a result Event.HasResult . ALLOW will apply this potion effect. DENY will not apply t