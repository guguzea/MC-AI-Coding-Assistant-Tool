---
title: "ItemStack"
description: "public final class ItemStack extends java.lang.Object implements ICapabilitySerializable<NBTTagCompound>"
package: "net/minecraft/item"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/item/ItemStack.html"
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
- `ItemStack(NBTTagCompound compound)`

## Methods

- `void addAttributeModifier(java.lang.String attributeName, AttributeModifier modifier, EntityEquipmentSlot equipmentSlot)`
- `void addEnchantment(Enchantment ench, int level)`
- `boolean areCapsCompatible(ItemStack other)`
- `static boolean areItemsEqual(ItemStack stackA, ItemStack stackB)`
- `static boolean areItemsEqualIgnoreDurability(ItemStack stackA, ItemStack stackB)`
- `static boolean areItemStacksEqual(ItemStack stackA, ItemStack stackB)`
- `static boolean areItemStacksEqualUsingNBTShareTag(ItemStack stackA, ItemStack stackB)` — Modeled after ItemStack.areItemStacksEqual Uses Item.getNBTShareTag for comparison instead of NBT and capabilities.
- `static boolean areItemStackShareTagsEqual(ItemStack stackA, ItemStack stackB)` — Modeled after ItemStack.areItemStackTagsEqual Uses Item.getNBTShareTag for comparison instead of NBT and capabilities.
- `static boolean areItemStackTagsEqual(ItemStack stackA, ItemStack stackB)`
- `boolean attemptDamageItem(int amount, java.util.Random rand, EntityPlayerMP damager)`
- `boolean canDestroy(Block blockIn)`
- `boolean canEditBlocks()`
- `boolean canHarvestBlock(IBlockState blockIn)`
- `boolean canPlaceOn(Block blockIn)`
- `void clearCustomName()`
- `ItemStack copy()`
- `void damageItem(int amount, EntityLivingBase entityIn)`
- `void deserializeNBT(NBTTagCompound nbt)`
- `boolean doesSneakBypassUse(IBlockAccess world, BlockPos pos, EntityPlayer player)` — Should this item, when held, allow sneak-clicks to pass through to the underlying block?
- `int getAnimationsToGo()`
- `<any> getAttributeModifiers(EntityEquipmentSlot equipmentSlot)`
- `<T> T getCapability(Capability<T> capability, EnumFacing facing)` — Retrieves the handler for the capability requested on the specific side.
- `int getCount()`
- `float getDestroySpeed(IBlockState blockIn)`
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
- `NBTTagCompound getOrCreateSubCompound(java.lang.String key)`
- `@Deprecated EnumRarity getRarity()`
- `int getRepairCost()`
- `NBTTagCompound getSubCompound(java.lang.String key)`
- `NBTTagCompound getTagCompound()`
- `ITextComponent getTextComponent()`
- `java.util.List<java.lang.String> getTooltip(EntityPlayer playerIn, ITooltipFlag advanced)`
- `java.lang.String getUnlocalizedName()`
- `void grow(int quantity)`
- `boolean hasCapability(Capability<?> capability, EnumFacing facing)` — Determines if this object has support for the capability in question on the specific side.
- `boolean hasDisplayName()`
- `boolean hasEffect()`
- `boolean hasTagCompound()`
- `void hitEntity(EntityLivingBase entityIn, EntityPlayer playerIn)`
- `boolean interactWithEntity(EntityPlayer playerIn, EntityLivingBase entityIn, EnumHand hand)`
- `boolean isEmpty()`
- `boolean isItemDamaged()`
- `boolean isItemEnchantable()`
- `boolean isItemEnchanted()`
- `boolean isItemEqual(ItemStack other)`
- `boolean isItemEqualIgnoreDurability(ItemStack stack)`
- `boolean isItemStackDamageable()`
- `boolean isOnItemFrame()`
- `boolean isStackable()`
- `void onBlockDestroyed(World worldIn, IBlockState blockIn, BlockPos pos, EntityPlayer playerIn)`
- `void onCrafting(World worldIn, EntityPlayer playerIn, int amount)`
- `EnumActionResult onItemUse(EntityPlayer playerIn, World worldIn, BlockPos pos, EnumHand hand, EnumFacing side, float hitX, float hitY, float hitZ)`
- `ItemStack onItemUseFinish(World worldIn, EntityLivingBase entityLiving)`
- `EnumActionResult onItemUseFirst(EntityPlayer playerIn, World worldIn, BlockPos pos, EnumHand hand, EnumFacing side, float hitX, float hitY, float hitZ)`
- `void onPlayerStoppedUsing(World worldIn, EntityLivingBase entityLiving, int timeLeft)`
- `static void registerFixes(DataFixer fixer)`
- `void removeSubCompound(java.lang.String key)`
- `NBTTagCompound serializeNBT()`
- `void setAnimationsToGo(int animations)`
- `void setCount(int size)`
- `void setItemDamage(int meta)`
- `void setItemFrame(EntityItemFrame frame)`
- `void setRepairCost(int cost)`
- `ItemStack setStackDisplayName(java.lang.String displayName)`
- `void setTagCompound(NBTTagCompound nbt)`
- `void setTagInfo(java.lang.String key, NBTBase value)`
- `ItemStack setTranslatableName(java.lang.String p_190924_1_)`
- `void shrink(int quantity)`
- `ItemStack splitStack(int amount)`
- `java.lang.String toString()`
- `void updateAnimation(World worldIn, Entity entityIn, int inventorySlot, boolean isCurrentItem)`
- `ActionResult<ItemStack> useItemRightClick(World worldIn, EntityPlayer playerIn, EnumHand hand)`
- `NBTTagCompound writeToNBT(NBTTagCompound nbt)`

## Fields

- `static java.text.DecimalFormat DECIMALFORMAT`
- `static ItemStack EMPTY`
