---
title: "LivingEquipmentChangeEvent"
description: "LivingEquipmentChangeEvent is fired when the Equipment of a Entity changes. This event is fired whenever changes in Equipment are detected in EntityLivingBase.onUpdate() . This also includes entities "
package: "net/minecraftforge/event/entity/living"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/entity/living/LivingEquipmentChangeEvent.html"
sourceType: javadoc
---

# LivingEquipmentChangeEvent

## Class signature

```java
public class LivingEquipmentChangeEvent extends LivingEvent
```

## Constructors

- `public LivingEquipmentChangeEvent( EntityLivingBase entity, EntityEquipmentSlot slot, @Nonnull ItemStack from, @Nonnull ItemStack to)`

## Methods

- `public EntityEquipmentSlot getSlot()`
- `@Nonnull public ItemStack getFrom()`
- `@Nonnull public ItemStack getTo()`

## Description

LivingEquipmentChangeEvent is fired when the Equipment of a Entity changes. This event is fired whenever changes in Equipment are detected in EntityLivingBase.onUpdate() . This also includes entities 
