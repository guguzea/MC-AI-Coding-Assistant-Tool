---
title: "ItemStack"
description: "Number of animation frames to go when receiving an item (by walking into it, for example)."
package: "net/minecraftforge/fml/common/registry"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/ItemStack.html"
sourceType: javadoc
---

# ItemStack

## Class signature

```java
public final class ItemStack extends java.lang.Object implements ICapabilitySerializable < NBTTagCompound >
```

## Constructors

- `public ItemStack( Block blockIn)`
- `public ItemStack( Block blockIn, int amount)`
- `public ItemStack( Block blockIn, int amount, int meta)`
- `public ItemStack( Item itemIn)`
- `public ItemStack( Item itemIn, int amount)`
- `public ItemStack( Item itemIn, int amount, int meta)`
- `public ItemStack( Item itemIn, int amount, int meta, NBTTagCompound capNBT)`

## Methods

- `public static ItemStack loadItemStackFromNBT( NBTTagCompound nbt)`
- `public ItemStack splitStack(int amount)`
- `public Item getItem()`
- `public boolean onItemUse( EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public float getStrVsBlock( Block blockIn)`
- `public ItemStack useItemRightClick( World worldIn, EntityPlayer playerIn)`
- `public ItemStack onItemUseFinish( World worldIn, EntityPlayer playerIn)`
- `public NBTTagCompound writeToNBT( NBTTagCompound nbt)`
- `public void readFromNBT( NBTTagCompound nbt)`
- `public int getMaxStackSize()`
- `public boolean isStackable()`
- `public boolean isItemStackDamageable()`
- `public boolean getHasSubtypes()`
- `public boolean isItemDamaged()`
- `public int getItemDamage()`
- `public int getMetadata()`
- `public void setItemDamage(int meta)`
- `public int getMaxDamage()`
- `public boolean attemptDamageItem(int amount, java.util.Random rand)`
- `public void damageItem(int amount, EntityLivingBase entityIn)`
- `public void hitEntity( EntityLivingBase entityIn, EntityPlayer playerIn)`
- `public void onBlockDestroyed( World worldIn, Block blockIn, BlockPos pos, EntityPlayer playerIn)`
- `public boolean canHarvestBlock( Block blockIn)`
- `public boolean interactWithEntity( EntityPlayer playerIn, EntityLivingBase entityIn)`
- `public ItemStack copy()`
- `public static boolean areItemStackTagsEqual( ItemStack stackA, ItemStack stackB)`
- `public static boolean areItemStacksEqual( ItemStack stackA, ItemStack stackB)`
- `public static boolean areItemsEqual( ItemStack stackA, ItemStack stackB)`
- `public boolean isItemEqual( ItemStack other)`
- `public java.lang.String getUnlocalizedName()`
- `public static ItemStack copyItemStack( ItemStack stack)`
- `public java.lang.String toString()`
- `public void updateAnimation( World worldIn, Entity entityIn, int inventorySlot, boolean isCurrentItem)`
- `public void onCrafting( World worldIn, EntityPlayer playerIn, int amount)`
- `public boolean getIsItemStackEqual( ItemStack p_179549_1_)`
- `public int getMaxItemUseDuration()`
- `public EnumAction getItemUseAction()`
- `public void onPlayerStoppedUsing( World worldIn, EntityPlayer playerIn, int timeLeft)`
- `public boolean hasTagCompound()`
- `public NBTTagCompound getTagCompound()`
- `public NBTTagCompound getSubCompound(java.lang.String key, boolean create)`
- `public NBTTagList getEnchantmentTagList()`
- `public void setTagCompound( NBTTagCompound nbt)`
- `public java.lang.String getDisplayName()`
- `public ItemStack setStackDisplayName(java.lang.String displayName)`
- `public void clearCustomName()`
- `public boolean hasDisplayName()`
- `public java.util.List<java.lang.String> getTooltip( EntityPlayer playerIn, boolean advanced)`
- `public boolean hasEffect()`
- `public EnumRarity getRarity()`
- `public boolean isItemEnchantable()`
- `public void addEnchantment( Enchantment ench, int level)`
- `public boolean isItemEnchanted()`
- `public void setTagInfo(java.lang.String key, NBTBase value)`
- `public boolean canEditBlocks()`
- `public boolean isOnItemFrame()`
- `public void setItemFrame( EntityItemFrame frame)`
- `public EntityItemFrame getItemFrame()`
- `public int getRepairCost()`
- `public void setRepairCost(int cost)`
- `public <any> getAttributeModifiers()`
- `public void setItem( Item newItem)`
- `public IChatComponent getChatComponent()`
- `public boolean canDestroy( Block blockIn)`
- `public boolean canPlaceOn( Block blockIn)`
- `public boolean hasCapability( Capability <?> capability, EnumFacing facing)`
- `public <T> T getCapability( Capability <T> capability, EnumFacing facing)`
- `public void deserializeNBT( NBTTagCompound nbt)`
- `public NBTTagCompound serializeNBT()`

## Description

Number of animation frames to go when receiving an item (by walking into it, for example).
