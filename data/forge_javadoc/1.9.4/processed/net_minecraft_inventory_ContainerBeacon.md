# ContainerBeacon

## Class signature

```java
public class ContainerBeacon extends Container
```

## Constructors

- `public ContainerBeacon( IInventory playerInventory, IInventory tileBeaconIn)`

## Methods

- `public void addListener( IContainerListener listener)`
- `public void updateProgressBar(int id, int data)`
- `public IInventory getTileEntity()`
- `public void onContainerClosed( EntityPlayer playerIn)`
- `public boolean canInteractWith( EntityPlayer playerIn)`
- `@Nullable public ItemStack transferStackInSlot( EntityPlayer playerIn, int index)`