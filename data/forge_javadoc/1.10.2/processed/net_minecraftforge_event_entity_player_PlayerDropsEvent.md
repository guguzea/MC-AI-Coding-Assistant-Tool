# PlayerDropsEvent

## Class signature

```java
public class PlayerDropsEvent extends LivingDropsEvent
```

## Constructors

- `public PlayerDropsEvent( EntityPlayer entity, DamageSource source, java.util.List< EntityItem > drops, boolean recentlyHit)`

## Methods

- `public EntityPlayer getEntityPlayer()`

## Description

Child class of LivingDropEvent that is fired specifically when a player dies. Canceling the event will prevent ALL drops from entering the world.