# ItemStack

## Class signature

```java
public final class ItemStack extends java.lang.Object
```

## Constructors

- `public ItemStack( Block p_i1876_1_)`
- `public ItemStack( Block p_i1877_1_, int p_i1877_2_)`
- `public ItemStack( Block p_i1878_1_, int p_i1878_2_, int p_i1878_3_)`
- `public ItemStack( Item p_i1879_1_)`
- `public ItemStack( Item p_i1880_1_, int p_i1880_2_)`
- `public ItemStack( Item p_i1881_1_, int p_i1881_2_, int p_i1881_3_)`

## Methods

- `public static ItemStack loadItemStackFromNBT( NBTTagCompound p_77949_0_)`
- `public ItemStack splitStack(int p_77979_1_)`
- `public Item getItem()`
- `public IIcon getIconIndex()`
- `public int getItemSpriteNumber()`
- `public boolean tryPlaceItemIntoWorld( EntityPlayer p_77943_1_, World p_77943_2_, int p_77943_3_, int p_77943_4_, int p_77943_5_, int p_77943_6_, float p_77943_7_, float p_77943_8_, float p_77943_9_)`
- `public float func_150997_a( Block p_150997_1_)`
- `public ItemStack useItemRightClick( World p_77957_1_, EntityPlayer p_77957_2_)`
- `public ItemStack onFoodEaten( World p_77950_1_, EntityPlayer p_77950_2_)`
- `public NBTTagCompound writeToNBT( NBTTagCompound p_77955_1_)`
- `public void readFromNBT( NBTTagCompound p_77963_1_)`
- `public int getMaxStackSize()`
- `public boolean isStackable()`
- `public boolean isItemStackDamageable()`
- `public boolean getHasSubtypes()`
- `public boolean isItemDamaged()`
- `public int getItemDamageForDisplay()`
- `public int getItemDamage()`
- `public void setItemDamage(int p_77964_1_)`
- `public int getMaxDamage()`
- `public boolean attemptDamageItem(int p_96631_1_, java.util.Random p_96631_2_)`
- `public void damageItem(int p_77972_1_, EntityLivingBase p_77972_2_)`
- `public void hitEntity( EntityLivingBase p_77961_1_, EntityPlayer p_77961_2_)`
- `public void func_150999_a( World p_150999_1_, Block p_150999_2_, int p_150999_3_, int p_150999_4_, int p_150999_5_, EntityPlayer p_150999_6_)`
- `public boolean func_150998_b( Block p_150998_1_)`
- `public boolean interactWithEntity( EntityPlayer p_111282_1_, EntityLivingBase p_111282_2_)`
- `public ItemStack copy()`
- `public static boolean areItemStackTagsEqual( ItemStack p_77970_0_, ItemStack p_77970_1_)`
- `public static boolean areItemStacksEqual( ItemStack p_77989_0_, ItemStack p_77989_1_)`
- `public boolean isItemEqual( ItemStack p_77969_1_)`
- `public java.lang.String getUnlocalizedName()`
- `public static ItemStack copyItemStack( ItemStack p_77944_0_)`
- `public java.lang.String toString()`
- `public void updateAnimation( World p_77945_1_, Entity p_77945_2_, int p_77945_3_, boolean p_77945_4_)`
- `public void onCrafting( World p_77980_1_, EntityPlayer p_77980_2_, int p_77980_3_)`
- `public int getMaxItemUseDuration()`
- `public EnumAction getItemUseAction()`
- `public void onPlayerStoppedUsing( World p_77974_1_, EntityPlayer p_77974_2_, int p_77974_3_)`
- `public boolean hasTagCompound()`
- `public NBTTagCompound getTagCompound()`
- `public NBTTagList getEnchantmentTagList()`
- `public void setTagCompound( NBTTagCompound p_77982_1_)`
- `public java.lang.String getDisplayName()`
- `public ItemStack setStackDisplayName(java.lang.String p_151001_1_)`
- `public void func_135074_t()`
- `public boolean hasDisplayName()`
- `public java.util.List getTooltip( EntityPlayer p_82840_1_, boolean p_82840_2_)`
- `public boolean hasEffect()`
- `public EnumRarity getRarity()`
- `public boolean isItemEnchantable()`
- `public void addEnchantment( Enchantment p_77966_1_, int p_77966_2_)`
- `public boolean isItemEnchanted()`
- `public void setTagInfo(java.lang.String p_77983_1_, NBTBase p_77983_2_)`
- `public boolean canEditBlocks()`
- `public boolean isOnItemFrame()`
- `public void setItemFrame( EntityItemFrame p_82842_1_)`
- `public EntityItemFrame getItemFrame()`
- `public int getRepairCost()`
- `public void setRepairCost(int p_82841_1_)`
- `public Multimap getAttributeModifiers()`
- `public void func_150996_a( Item p_150996_1_)`
- `public IChatComponent func_151000_E()`