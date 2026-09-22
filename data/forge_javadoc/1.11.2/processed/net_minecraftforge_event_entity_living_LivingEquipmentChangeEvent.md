# LivingEquipmentChangeEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.living.LivingEquipmentChangeEvent

## Class signature

```java
public class LivingEquipmentChangeEvent extends LivingEvent
```

## Constructors

- `LivingEquipmentChangeEvent(EntityLivingBase entity, EntityEquipmentSlot slot, ItemStack from, ItemStack to)`

## Methods

- `ItemStack getFrom()`
- `EntityEquipmentSlot getSlot()`
- `ItemStack getTo()`