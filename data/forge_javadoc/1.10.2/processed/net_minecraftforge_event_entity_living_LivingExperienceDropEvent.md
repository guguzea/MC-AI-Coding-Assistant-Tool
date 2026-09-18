# LivingExperienceDropEvent

## Class signature

```java
public class LivingExperienceDropEvent extends LivingEvent
```

## Constructors

- `public LivingExperienceDropEvent( EntityLivingBase entity, EntityPlayer attackingPlayer, int originalExperience)`

## Methods

- `public int getDroppedExperience()`
- `public void setDroppedExperience(int droppedExperience)`
- `public EntityPlayer getAttackingPlayer()`
- `public int getOriginalExperience()`

## Description

Event for when an entity drops experience on its death, can be used to change the amount of experience points dropped or completely prevent dropping of experience by canceling the event.