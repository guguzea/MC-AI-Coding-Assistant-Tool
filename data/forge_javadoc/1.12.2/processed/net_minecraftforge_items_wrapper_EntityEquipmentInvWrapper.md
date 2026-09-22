# EntityEquipmentInvWrapper

**Inheritance:** java.lang.Object → net.minecraftforge.items.wrapper.EntityEquipmentInvWrapper

## Class signature

```java
public abstract class EntityEquipmentInvWrapper extends java.lang.Object implements IItemHandlerModifiable
```

## Constructors

- `EntityEquipmentInvWrapper(EntityLivingBase entity, EntityEquipmentSlot.Type slotType)`

## Methods

- `ItemStack extractItem(int slot, int amount, boolean simulate)` — Extracts an ItemStack from the given slot.
- `int getSlotLimit(int slot)` — Retrieves the maximum stack size allowed to exist in the given slot.
- `int getSlots()` — Returns the number of slots available
- `ItemStack getStackInSlot(int slot)` — Returns the ItemStack in a given slot.
- `protected int getStackLimit(int slot, ItemStack stack)`
- `ItemStack insertItem(int slot, ItemStack stack, boolean simulate)` — Inserts an ItemStack into the given slot and return the remainder.
- `boolean isItemValid(int slot, ItemStack stack)` — This function re-implements the vanilla function IInventory.isItemValidForSlot(int, ItemStack) .
- `void setStackInSlot(int slot, ItemStack stack)` — Overrides the stack in the given slot.
- `protected EntityEquipmentSlot validateSlotIndex(int slot)`

## Fields

- `protected EntityLivingBase entity` — The entity.
- `protected java.util.List<EntityEquipmentSlot> slots` — The slots exposed by this wrapper, with EntityEquipmentSlot.index as the index.