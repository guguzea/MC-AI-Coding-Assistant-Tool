# LivingEquipmentChangeEvent

## Class signature

```java
public class LivingEquipmentChangeEvent extends LivingEvent
```

## Constructors

- `public LivingEquipmentChangeEvent( EntityLivingBase entity, EntityEquipmentSlot slot, ItemStack from, ItemStack to)`

## Methods

- `public EntityEquipmentSlot getSlot()`
- `public ItemStack getFrom()`
- `public ItemStack getTo()`

## Description

LivingEquipmentChangeEvent is fired when the Equipment of a Entity changes. This event is fired whenever changes in Equipment are detected in EntityLivingBase.onUpdate() . This also includes entities