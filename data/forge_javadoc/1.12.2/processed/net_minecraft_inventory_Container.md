# Container

## Class signature

```java
public abstract class Container extends java.lang.Object
```

## Constructors

- `public Container()`

## Methods

- `protected Slot addSlotToContainer( Slot slotIn)`
- `public void addListener( IContainerListener listener)`
- `public NonNullList < ItemStack > getInventory()`
- `public void removeListener( IContainerListener listener)`
- `public void detectAndSendChanges()`
- `public boolean enchantItem( EntityPlayer playerIn, int id)`
- `public Slot getSlotFromInventory( IInventory inv, int slotIn)`
- `public Slot getSlot(int slotId)`
- `public ItemStack transferStackInSlot( EntityPlayer playerIn, int index)`
- `public ItemStack slotClick(int slotId, int dragType, ClickType clickTypeIn, EntityPlayer player)`
- `public boolean canMergeSlot( ItemStack stack, Slot slotIn)`
- `public void onContainerClosed( EntityPlayer playerIn)`
- `protected void clearContainer( EntityPlayer playerIn, World worldIn, IInventory inventoryIn)`
- `public void onCraftMatrixChanged( IInventory inventoryIn)`
- `public void putStackInSlot(int slotID, ItemStack stack)`
- `public void setAll(java.util.List< ItemStack > p_190896_1_)`
- `public void updateProgressBar(int id, int data)`
- `public short getNextTransactionID( InventoryPlayer invPlayer)`
- `public boolean getCanCraft( EntityPlayer player)`
- `public void setCanCraft( EntityPlayer player, boolean canCraft)`
- `public abstract boolean canInteractWith( EntityPlayer playerIn)`
- `protected boolean mergeItemStack( ItemStack stack, int startIndex, int endIndex, boolean reverseDirection)`
- `public static int extractDragMode(int eventButton)`
- `public static int getDragEvent(int clickedButton)`
- `public static int getQuickcraftMask(int p_94534_0_, int p_94534_1_)`
- `public static boolean isValidDragMode(int dragModeIn, EntityPlayer player)`
- `protected void resetDrag()`
- `public static boolean canAddItemToSlot( Slot slotIn, ItemStack stack, boolean stackSizeMatters)`
- `public static void computeStackSize(java.util.Set< Slot > dragSlotsIn, int dragModeIn, ItemStack stack, int slotStackSize)`
- `public boolean canDragIntoSlot( Slot slotIn)`
- `public static int calcRedstone( TileEntity te)`
- `public static int calcRedstoneFromInventory( IInventory inv)`
- `protected void slotChangedCraftingGrid( World p_192389_1_, EntityPlayer p_192389_2_, InventoryCrafting p_192389_3_, InventoryCraftResult p_192389_4_)`