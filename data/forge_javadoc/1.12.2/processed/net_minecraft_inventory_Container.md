# Container

**Inheritance:** java.lang.Object → net.minecraft.inventory.Container

## Class signature

```java
public abstract class Container extends java.lang.Object
```

## Constructors

- `Container()`

## Methods

- `void addListener(IContainerListener listener)`
- `protected Slot addSlotToContainer(Slot slotIn)`
- `static int calcRedstone(TileEntity te)`
- `static int calcRedstoneFromInventory(IInventory inv)`
- `static boolean canAddItemToSlot(Slot slotIn, ItemStack stack, boolean stackSizeMatters)`
- `boolean canDragIntoSlot(Slot slotIn)`
- `abstract boolean canInteractWith(EntityPlayer playerIn)`
- `boolean canMergeSlot(ItemStack stack, Slot slotIn)`
- `protected void clearContainer(EntityPlayer playerIn, World worldIn, IInventory inventoryIn)`
- `static void computeStackSize(java.util.Set<Slot> dragSlotsIn, int dragModeIn, ItemStack stack, int slotStackSize)`
- `void detectAndSendChanges()`
- `boolean enchantItem(EntityPlayer playerIn, int id)`
- `static int extractDragMode(int eventButton)`
- `boolean getCanCraft(EntityPlayer player)`
- `static int getDragEvent(int clickedButton)`
- `NonNullList<ItemStack> getInventory()`
- `short getNextTransactionID(InventoryPlayer invPlayer)`
- `static int getQuickcraftMask(int p_94534_0_, int p_94534_1_)`
- `Slot getSlot(int slotId)`
- `Slot getSlotFromInventory(IInventory inv, int slotIn)`
- `static boolean isValidDragMode(int dragModeIn, EntityPlayer player)`
- `protected boolean mergeItemStack(ItemStack stack, int startIndex, int endIndex, boolean reverseDirection)`
- `void onContainerClosed(EntityPlayer playerIn)`
- `void onCraftMatrixChanged(IInventory inventoryIn)`
- `void putStackInSlot(int slotID, ItemStack stack)`
- `void removeListener(IContainerListener listener)`
- `protected void resetDrag()`
- `void setAll(java.util.List<ItemStack> p_190896_1_)`
- `void setCanCraft(EntityPlayer player, boolean canCraft)`
- `protected void slotChangedCraftingGrid(World p_192389_1_, EntityPlayer p_192389_2_, InventoryCrafting p_192389_3_, InventoryCraftResult p_192389_4_)`
- `ItemStack slotClick(int slotId, int dragType, ClickType clickTypeIn, EntityPlayer player)`
- `ItemStack transferStackInSlot(EntityPlayer playerIn, int index)`
- `void updateProgressBar(int id, int data)`

## Fields

- `NonNullList<ItemStack> inventoryItemStacks`
- `java.util.List<Slot> inventorySlots`
- `protected java.util.List<IContainerListener> listeners`
- `int windowId`