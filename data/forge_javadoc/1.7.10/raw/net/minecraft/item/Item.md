---
title: "Item"
description: "public class Item extends java.lang.Object"
package: "net/minecraft/item"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/item/Item.html"
sourceType: javadoc
---

# Item

**Inheritance:** java.lang.Object → net.minecraft.item.Item

## Class signature

```java
public class Item extends java.lang.Object
```

## Constructors

- `Item()`

## Methods

- `void addInformation(ItemStack p_77624_1_, EntityPlayer p_77624_2_, java.util.List p_77624_3_, boolean p_77624_4_)`
- `boolean canItemEditBlocks()`
- `boolean doesContainerItemLeaveCraftingGrid(ItemStack p_77630_1_)`
- `float func_150893_a(ItemStack p_150893_1_, Block p_150893_2_)`
- `boolean func_150897_b(Block p_150897_1_)`
- `int getColorFromItemStack(ItemStack p_82790_1_, int p_82790_2_)`
- `Item getContainerItem()`
- `CreativeTabs getCreativeTab()`
- `boolean getHasSubtypes()`
- `IIcon getIconFromDamage(int p_77617_1_)`
- `IIcon getIconFromDamageForRenderPass(int p_77618_1_, int p_77618_2_)`
- `IIcon getIconIndex(ItemStack p_77650_1_)`
- `protected java.lang.String getIconString()`
- `static int getIdFromItem(Item p_150891_0_)`
- `boolean getIsRepairable(ItemStack p_82789_1_, ItemStack p_82789_2_)`
- `Multimap getItemAttributeModifiers()`
- `static Item getItemById(int p_150899_0_)`
- `int getItemEnchantability()`
- `static Item getItemFromBlock(Block p_150898_0_)`
- `java.lang.String getItemStackDisplayName(ItemStack p_77653_1_)`
- `int getItemStackLimit()`
- `EnumAction getItemUseAction(ItemStack p_77661_1_)`
- `int getMaxDamage()`
- `int getMaxItemUseDuration(ItemStack p_77626_1_)`
- `int getMetadata(int p_77647_1_)`
- `protected MovingObjectPosition getMovingObjectPositionFromPlayer(World p_77621_1_, EntityPlayer p_77621_2_, boolean p_77621_3_)`
- `java.lang.String getPotionEffect(ItemStack p_150896_1_)`
- `EnumRarity getRarity(ItemStack p_77613_1_)`
- `boolean getShareTag()`
- `int getSpriteNumber()`
- `void getSubItems(Item p_150895_1_, CreativeTabs p_150895_2_, java.util.List p_150895_3_)`
- `java.lang.String getUnlocalizedName()`
- `java.lang.String getUnlocalizedName(ItemStack p_77667_1_)`
- `java.lang.String getUnlocalizedNameInefficiently(ItemStack p_77657_1_)`
- `boolean hasContainerItem()`
- `boolean hasEffect(ItemStack p_77636_1_)`
- `boolean hitEntity(ItemStack p_77644_1_, EntityLivingBase p_77644_2_, EntityLivingBase p_77644_3_)`
- `boolean isDamageable()`
- `boolean isFull3D()`
- `boolean isItemTool(ItemStack p_77616_1_)`
- `boolean isMap()`
- `boolean isPotionIngredient(ItemStack p_150892_1_)`
- `boolean itemInteractionForEntity(ItemStack p_111207_1_, EntityPlayer p_111207_2_, EntityLivingBase p_111207_3_)`
- `boolean onBlockDestroyed(ItemStack p_150894_1_, World p_150894_2_, Block p_150894_3_, int p_150894_4_, int p_150894_5_, int p_150894_6_, EntityLivingBase p_150894_7_)`
- `void onCreated(ItemStack p_77622_1_, World p_77622_2_, EntityPlayer p_77622_3_)`
- `ItemStack onEaten(ItemStack p_77654_1_, World p_77654_2_, EntityPlayer p_77654_3_)`
- `ItemStack onItemRightClick(ItemStack p_77659_1_, World p_77659_2_, EntityPlayer p_77659_3_)`
- `boolean onItemUse(ItemStack p_77648_1_, EntityPlayer p_77648_2_, World p_77648_3_, int p_77648_4_, int p_77648_5_, int p_77648_6_, int p_77648_7_, float p_77648_8_, float p_77648_9_, float p_77648_10_)`
- `void onPlayerStoppedUsing(ItemStack p_77615_1_, World p_77615_2_, EntityPlayer p_77615_3_, int p_77615_4_)`
- `void onUpdate(ItemStack p_77663_1_, World p_77663_2_, Entity p_77663_3_, int p_77663_4_, boolean p_77663_5_)`
- `void registerIcons(IIconRegister p_94581_1_)`
- `static void registerItems()`
- `boolean requiresMultipleRenderPasses()`
- `Item setContainerItem(Item p_77642_1_)`
- `Item setCreativeTab(CreativeTabs p_77637_1_)`
- `Item setFull3D()`
- `Item setHasSubtypes(boolean p_77627_1_)`
- `Item setMaxDamage(int p_77656_1_)`
- `Item setMaxStackSize(int p_77625_1_)`
- `Item setPotionEffect(java.lang.String p_77631_1_)`
- `Item setTextureName(java.lang.String p_111206_1_)`
- `Item setUnlocalizedName(java.lang.String p_77655_1_)`
- `boolean shouldRotateAroundWhenRendering()`

## Fields

- `protected boolean bFull3D`
- `RegistryDelegate<Item> delegate`
- `protected static java.util.UUID field_111210_e`
- `protected boolean hasSubtypes`
- `protected java.lang.String iconString`
- `protected IIcon itemIcon`
- `protected static java.util.Random itemRand`
- `static RegistryNamespaced itemRegistry`
- `protected int maxStackSize`
