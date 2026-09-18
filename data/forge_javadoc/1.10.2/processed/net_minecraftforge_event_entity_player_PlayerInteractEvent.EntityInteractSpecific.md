# PlayerInteractEvent.EntityInteractSpecific

## Constructors

- `public EntityInteractSpecific( EntityPlayer player, EnumHand hand, ItemStack stack, Entity target, Vec3d localPos)`

## Methods

- `public Vec3d getLocalPos()`
- `public Entity getTarget()`

## Description

This event is fired on both sides whenever a player right clicks an entity. "Interact at" is an interact where the local vector (which part of the entity you clicked) is known. The state of this event