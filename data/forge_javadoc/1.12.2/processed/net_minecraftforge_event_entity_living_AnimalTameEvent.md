# AnimalTameEvent

## Class signature

```java
public class AnimalTameEvent extends LivingEvent
```

## Constructors

- `public AnimalTameEvent( EntityAnimal animal, EntityPlayer tamer)`

## Methods

- `public EntityAnimal getAnimal()`
- `public EntityPlayer getTamer()`

## Description

This event is fired when an EntityAnimal is tamed. It is fired via ForgeEventFactory.onAnimalTame(EntityAnimal, EntityPlayer) . Forge fires this event for applicable vanilla animals, mods need to fire