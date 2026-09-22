# Container

**Inheritance:** java.lang.Object → net.minecraft.inventory.Container

## Class signature

```java
public abstract class Container extends java.lang.Object
```

## Constructors

- `Container()`

## Methods

- `void addCraftingToCrafters(ICrafting p_75132_1_)`
- `protected Slot addSlotToContainer(Slot p_75146_1_)`
- `static int calcRedstoneFromInventory(IInventory p_94526_0_)`
- `boolean canDragIntoSlot(Slot p_94531_1_)`
- `abstract boolean canInteractWith(EntityPlayer p_75145_1_)`
- `void detectAndSendChanges()`
- `boolean enchantItem(EntityPlayer p_75140_1_, int p_75140_2_)`
- `static void func_94525_a(java.util.Set p_94525_0_, int p_94525_1_, ItemStack p_94525_2_, int p_94525_3_)`
- `static boolean func_94527_a(Slot p_94527_0_, ItemStack p_94527_1_, boolean p_94527_2_)`
- `static boolean func_94528_d(int p_94528_0_)`
- `static int func_94529_b(int p_94529_0_)`
- `boolean func_94530_a(ItemStack p_94530_1_, Slot p_94530_2_)`
- `static int func_94532_c(int p_94532_0_)`
- `protected void func_94533_d()`
- `static int func_94534_d(int p_94534_0_, int p_94534_1_)`
- `java.util.List getInventory()`
- `short getNextTransactionID(InventoryPlayer p_75136_1_)`
- `Slot getSlot(int p_75139_1_)`
- `Slot getSlotFromInventory(IInventory p_75147_1_, int p_75147_2_)`
- `boolean isPlayerNotUsingContainer(EntityPlayer p_75129_1_)`
- `protected boolean mergeItemStack(ItemStack p_75135_1_, int p_75135_2_, int p_75135_3_, boolean p_75135_4_)`
- `void onContainerClosed(EntityPlayer p_75134_1_)`
- `void onCraftMatrixChanged(IInventory p_75130_1_)`
- `void putStackInSlot(int p_75141_1_, ItemStack p_75141_2_)`
- `void putStacksInSlots(ItemStack [] p_75131_1_)`
- `void removeCraftingFromCrafters(ICrafting p_82847_1_)`
- `protected void retrySlotClick(int p_75133_1_, int p_75133_2_, boolean p_75133_3_, EntityPlayer p_75133_4_)`
- `void setPlayerIsPresent(EntityPlayer p_75128_1_, boolean p_75128_2_)`
- `ItemStack slotClick(int p_75144_1_, int p_75144_2_, int p_75144_3_, EntityPlayer p_75144_4_)`
- `ItemStack transferStackInSlot(EntityPlayer p_82846_1_, int p_82846_2_)`
- `void updateProgressBar(int p_75137_1_, int p_75137_2_)`

## Fields

- `protected java.util.List crafters`
- `java.util.List inventoryItemStacks`
- `java.util.List inventorySlots`
- `int windowId`