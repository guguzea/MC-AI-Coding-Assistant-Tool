# LivingDeathEvent

## Class signature

```java
public class LivingDeathEvent extends LivingEvent
```

## Constructors

- `public LivingDeathEvent( EntityLivingBase entity, DamageSource source)`

## Methods

- `public DamageSource getSource()`

## Description

LivingDeathEvent is fired when an Entity dies. This event is fired whenever an Entity dies in EntityLivingBase.onDeath(DamageSource) , EntityPlayer.onDeath(DamageSource) , and EntityPlayerMP.onDeath(D