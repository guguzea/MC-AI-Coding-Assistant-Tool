# LivingEntityUseItemEvent.Tick

## Constructors

- `public Tick( EntityLivingBase entity, @Nonnull ItemStack item, int duration)`

## Description

Fired every tick that a player is 'using' an item, see LivingEntityUseItemEvent.Start for info. Cancel the event, or set the duration or <= 0 to cause the player to stop using the item.