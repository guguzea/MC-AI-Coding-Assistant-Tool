---
title: "ItemStack"
description: "public final class ItemStack extends java.lang.Object implements ICapabilitySerializable<NBTTagCompound>"
package: "net/minecraft/item"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/item/ItemStack.html"
sourceType: javadoc
---

# ItemStack

**Inheritance:** java.lang.Object → net.minecraft.item.ItemStack

## Class signature

```java
public final class ItemStack extends java.lang.Object implements ICapabilitySerializable<NBTTagCompound>
```

## Constructors

- `ItemStack(Block blockIn)`
- `ItemStack(Block blockIn, int amount)`
- `ItemStack(Block blockIn, int amount, int meta)`
- `ItemStack(Item itemIn)`
- `ItemStack(Item itemIn, int amount)`
- `ItemStack(Item itemIn, int amount, int meta)`
- `ItemStack(Item itemIn, int amount, int meta, NBTTagCompound capNBT)`

## Methods

- `void addAttributeModifier(java.lang.String attributeName, AttributeModifier modifier, EntityEquipmentSlot equipmentSlot)`
- `void addEnchantment(Enchantment ench, int level)`
- `static boolean areItemsEqual(ItemStack stackA, ItemStack stackB)`
- `static boolean areItemsEqualIgnoreDurability(ItemStack stackA, ItemStack stackB)`
- `static boolean areItemStacksEqual(ItemStack stackA, ItemStack stackB)`
- `static boolean areItemStackTagsEqual(ItemStack stackA, ItemStack stackB)`
- `boolean attemptDamageItem(int amount, java.util.Random rand)`
- `boolean canDestroy(Block blockIn)`
- `boolean canEditBlocks()`
- `boolean canHarvestBlock(IBlockState blockIn)`
- `boolean canPlaceOn(Block blockIn)`
- `void clearCustomName()`
- `ItemStack copy()`
- `static ItemStack copyItemStack(ItemStack stack)`
- `void damageItem(int amount, EntityLivingBase entityIn)`
- `void deserializeNBT(NBTTagCompound nbt)`
- `com.google.common.collect.Multimap<java.lang.String, AttributeModifier> getAttributeModifiers(EntityEquipmentSlot equipmentSlot)`
- `<T> T getCapability(Capability<T> capability, EnumFacing facing)` — Retrieves the handler for the capability requested on the specific side.
- `java.lang.String getDisplayName()`
- `NBTTagList getEnchantmentTagList()`
- `boolean getHasSubtypes()`
- `Item getItem()`
- `int getItemDamage()`
- `EntityItemFrame getItemFrame()`
- `EnumAction getItemUseAction()`
- `int getMaxDamage()`
- `int getMaxItemUseDuration()`
- `int getMaxStackSize()`
- `int getMetadata()`
- `EnumRarity getRarity()`
- `int getRepairCost()`
- `float getStrVsBlock(IBlockState blockIn)`
- `NBTTagCompound getSubCompound(java.lang.String key, boolean create)`
- `NBTTagCompound getTagCompound()`
- `ITextComponent getTextComponent()`
- `java.util.List<java.lang.String> getTooltip(EntityPlayer playerIn, boolean advanced)`
- `java.lang.String getUnlocalizedName()`
- `boolean hasCapability(Capability<?> capability, EnumFacing facing)` — Determines if this object has support for the capability in question on the specific side.
- `boolean hasDisplayName()`
- `boolean hasEffect()`
- `boolean hasTagCompound()`
- `void hitEntity(EntityLivingBase entityIn, EntityPlayer playerIn)`
- `boolean interactWithEntity(EntityPlayer playerIn, EntityLivingBase entityIn, EnumHand hand)`
- `boolean isItemDamaged()`
- `boolean isItemEnchantable()`
- `boolean isItemEnchanted()`
- `boolean isItemEqual(ItemStack other)`
- `boolean isItemEqualIgnoreDurability(ItemStack stack)`
- `boolean isItemStackDamageable()`
- `boolean isOnItemFrame()`
- `boolean isStackable()`
- `static ItemStack loadItemStackFromNBT(NBTTagCompound nbt)`
- `void onBlockDestroyed(World worldIn, IBlockState blockIn, BlockPos pos, EntityPlayer playerIn)`
- `void onCrafting(World worldIn, EntityPlayer playerIn, int amount)`
- `EnumActionResult onItemUse(EntityPlayer playerIn, World worldIn, BlockPos pos, EnumHand hand, EnumFacing side, float hitX, float hitY, float hitZ)`
- `ItemStack onItemUseFinish(World worldIn, EntityLivingBase entityLiving)`
- `void onPlayerStoppedUsing(World worldIn, EntityLivingBase entityLiving, int timeLeft)`
- `void readFromNBT(NBTTagCompound nbt)`
- `NBTTagCompound serializeNBT()`
- `@Deprecated void setItem(Item newItem)`
- `void setItemDamage(int meta)`
- `void setItemFrame(EntityItemFrame frame)`
- `void setRepairCost(int cost)`
- `ItemStack setStackDisplayName(java.lang.String displayName)`
- `void setTagCompound(NBTTagCompound nbt)`
- `void setTagInfo(java.lang.String key, NBTBase value)`
- `ItemStack splitStack(int amount)`
- `java.lang.String toString()`
- `void updateAnimation(World worldIn, Entity entityIn, int inventorySlot, boolean isCurrentItem)`
- `ActionResult<ItemStack> useItemRightClick(World worldIn, EntityPlayer playerIn, EnumHand hand)`
- `NBTTagCompound writeToNBT(NBTTagCompound nbt)`

## Fields

- `int animationsToGo`
- `static java.text.DecimalFormat DECIMALFORMAT`
- `int stackSize`
