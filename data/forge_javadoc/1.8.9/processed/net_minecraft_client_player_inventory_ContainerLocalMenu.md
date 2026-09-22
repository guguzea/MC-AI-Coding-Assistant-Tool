# ContainerLocalMenu

**Inheritance:** java.lang.Object → net.minecraft.inventory.InventoryBasic → net.minecraft.client.player.inventory.ContainerLocalMenu

## Class signature

```java
public class ContainerLocalMenu extends InventoryBasic implements ILockableContainer
```

## Constructors

- `ContainerLocalMenu(java.lang.String id, IChatComponent title, int slotCount)`

## Methods

- `Container createContainer(InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `int getField(int id)`
- `int getFieldCount()`
- `java.lang.String getGuiID()`
- `LockCode getLockCode()`
- `boolean isLocked()`
- `void setField(int id, int value)`
- `void setLockCode(LockCode code)`