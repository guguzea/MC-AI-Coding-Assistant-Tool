# ContainerLocalMenu

## Class signature

```java
public class ContainerLocalMenu extends InventoryBasic implements ILockableContainer
```

## Constructors

- `public ContainerLocalMenu(java.lang.String id, ITextComponent title, int slotCount)`

## Methods

- `public int getField(int id)`
- `public void setField(int id, int value)`
- `public int getFieldCount()`
- `public boolean isLocked()`
- `public void setLockCode( LockCode code)`
- `public LockCode getLockCode()`
- `public java.lang.String getGuiID()`
- `public Container createContainer( InventoryPlayer playerInventory, EntityPlayer playerIn)`