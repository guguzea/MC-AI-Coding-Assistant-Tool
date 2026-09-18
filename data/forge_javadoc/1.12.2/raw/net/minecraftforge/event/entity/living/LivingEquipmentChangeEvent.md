---
title: "LivingEquipmentChangeEvent"
description: "LivingEquipmentChangeEvent is fired when the Equipment of a Entity changes. This event is fired whenever changes in Equipment are detected in EntityLivingBase.onUpdate() . This also includes entities "
package: "net/minecraftforge/event/entity/living"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/entity/living/LivingEquipmentChangeEvent.html"
sourceType: javadoc
---

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
