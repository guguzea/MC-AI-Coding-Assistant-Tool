# PlayerInteractEvent.EntityInteract

## Constructors

- `public EntityInteract( EntityPlayer player, EnumHand hand, Entity target)`

## Methods

- `public Entity getTarget()`

## Description

This event is fired on both sides when the player right clicks an entity. It is responsible for all general entity interactions. This event is fired only if the result of the above PlayerInteractEvent