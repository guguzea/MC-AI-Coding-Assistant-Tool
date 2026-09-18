# PlayerPickupXpEvent

## Class signature

```java
public class PlayerPickupXpEvent extends PlayerEvent
```

## Constructors

- `public PlayerPickupXpEvent( EntityPlayer player, EntityXPOrb orb)`

## Methods

- `public EntityXPOrb getOrb()`

## Description

This event is called when a player collides with a EntityXPOrb on the ground. The event can be canceled, and no further processing will be done.