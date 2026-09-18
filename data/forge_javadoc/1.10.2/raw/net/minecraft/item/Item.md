---
title: "Item"
description: "ItemStack sensitive version of canHarvestBlock(IBlockState)"
package: "net/minecraft/item"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/item/Item.html"
sourceType: javadoc
---

# Item

## Class signature

```java
public class Item extends IForgeRegistryEntry.Impl < Item >
```

## Constructors

- `public Item()`

## Methods

- `public static int getIdFromItem( Item itemIn)`
- `public static Item getItemById(int id)`
- `@Nullable public static Item getItemFromBlock( Block blockIn)`
- `public static Item getByNameOrId(java.lang.String id)`
- `public final void addPropertyOverride( ResourceLocation key, IItemPropertyGetter getter)`
- `@Nullable public IItemPropertyGetter getPropertyGetter( ResourceLocation key)`
- `public boolean updateItemStackNBT( NBTTagCompound nbt)`
- `public boolean hasCustomProperties()`
- `public Item setMaxStackSize(int maxStackSize)`
- `public EnumActionResult onItemUse( ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public float getStrVsBlock( ItemStack stack, IBlockState state)`
- `public ActionResult < ItemStack > onItemRightClick( ItemStack itemStackIn, World worldIn, EntityPlayer playerIn, EnumHand hand)`
- `@Nullable public ItemStack onItemUseFinish( ItemStack stack, World worldIn, EntityLivingBase entityLiving)`
- `@Deprecated public int getItemStackLimit()`
- `public int getMetadata(int damage)`
- `public boolean getHasSubtypes()`
- `public Item setHasSubtypes(boolean hasSubtypes)`
- `@Deprecated public int getMaxDamage()`
- `public Item setMaxDamage(int maxDamageIn)`
- `public boolean isDamageable()`
- `public boolean hitEntity( ItemStack stack, EntityLivingBase target, EntityLivingBase attacker)`
- `public boolean onBlockDestroyed( ItemStack stack, World worldIn, IBlockState state, BlockPos pos, EntityLivingBase entityLiving)`
- `public boolean canHarvestBlock( IBlockState blockIn)`
- `public boolean itemInteractionForEntity( ItemStack stack, EntityPlayer playerIn, EntityLivingBase target, EnumHand hand)`
- `public Item setFull3D()`
- `public boolean isFull3D()`
- `public boolean shouldRotateAroundWhenRendering()`
- `public Item setUnlocalizedName(java.lang.String unlocalizedName)`
- `public java.lang.String getUnlocalizedNameInefficiently( ItemStack stack)`
- `public java.lang.String getUnlocalizedName()`
- `public java.lang.String getUnlocalizedName( ItemStack stack)`
- `public Item setContainerItem( Item containerItem)`
- `public boolean getShareTag()`
- `public Item getContainerItem()`
- `@Deprecated public boolean hasContainerItem()`
- `public void onUpdate( ItemStack stack, World worldIn, Entity entityIn, int itemSlot, boolean isSelected)`
- `public void onCreated( ItemStack stack, World worldIn, EntityPlayer playerIn)`
- `public boolean isMap()`
- `public EnumAction getItemUseAction( ItemStack stack)`
- `public int getMaxItemUseDuration( ItemStack stack)`
- `public void onPlayerStoppedUsing( ItemStack stack, World worldIn, EntityLivingBase entityLiving, int timeLeft)`
- `public void addInformation( ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)`
- `public java.lang.String getItemStackDisplayName( ItemStack stack)`
- `public boolean hasEffect( ItemStack stack)`
- `public EnumRarity getRarity( ItemStack stack)`
- `public boolean isItemTool( ItemStack stack)`
- `protected RayTraceResult rayTrace( World worldIn, EntityPlayer playerIn, boolean useLiquids)`
- `public int getItemEnchantability()`
- `public void getSubItems( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > subItems)`
- `public Item setCreativeTab( CreativeTabs tab)`
- `public CreativeTabs getCreativeTab()`
- `public boolean canItemEditBlocks()`
- `public boolean getIsRepairable( ItemStack toRepair, ItemStack repair)`
- `@Deprecated public com.google.common.collect.Multimap<java.lang.String, AttributeModifier > getItemAttributeModifiers( EntityEquipmentSlot equipmentSlot)`
- `public com.google.common.collect.Multimap<java.lang.String, AttributeModifier > getAttributeModifiers( EntityEquipmentSlot slot, ItemStack stack)`
- `public boolean onDroppedByPlayer( ItemStack item, EntityPlayer player)`
- `public java.lang.String getHighlightTip( ItemStack item, java.lang.String displayName)`
- `public EnumActionResult onItemUseFirst( ItemStack stack, EntityPlayer player, World world, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ, EnumHand hand)`
- `public boolean isRepairable()`
- `public Item setNoRepair()`
- `public NBTTagCompound getNBTShareTag( ItemStack stack)`
- `public boolean onBlockStartBreak( ItemStack itemstack, BlockPos pos, EntityPlayer player)`
- `public void onUsingTick( ItemStack stack, EntityLivingBase player, int count)`
- `public boolean onLeftClickEntity( ItemStack stack, EntityPlayer player, Entity entity)`
- `public ItemStack getContainerItem( ItemStack itemStack)`
- `public boolean hasContainerItem( ItemStack stack)`
- `public int getEntityLifespan( ItemStack itemStack, World world)`
- `public boolean hasCustomEntity( ItemStack stack)`
- `public Entity createEntity( World world, Entity location, ItemStack itemstack)`
- `public boolean onEntityItemUpdate( EntityItem entityItem)`
- `public CreativeTabs [] getCreativeTabs()`
- `public float getSmeltingExperience( ItemStack item)`
- `public boolean doesSneakBypassUse( ItemStack stack, IBlockAccess world, BlockPos pos, EntityPlayer player)`
- `public void onArmorTick( World world, EntityPlayer player, ItemStack itemStack)`
- `public boolean isValidArmor( ItemStack stack, EntityEquipmentSlot armorType, Entity entity)`
- `public boolean isBookEnchantable( ItemStack stack, ItemStack book)`
- `public java.lang.String getArmorTexture( ItemStack stack, Entity entity, EntityEquipmentSlot slot, java.lang.String type)`
- `public FontRenderer getFontRenderer( ItemStack stack)`
- `public ModelBiped getArmorModel( EntityLivingBase entityLiving, ItemStack itemStack, EntityEquipmentSlot armorSlot, ModelBiped _default)`
- `public boolean onEntitySwing( EntityLivingBase entityLiving, ItemStack stack)`
- `public void renderHelmetOverlay( ItemStack stack, EntityPlayer player, ScaledResolution resolution, float partialTicks)`
- `public int getDamage( ItemStack stack)`
- `public int getMetadata( ItemStack stack)`
- `public boolean showDurabilityBar( ItemStack stack)`
- `public double getDurabilityForDisplay( ItemStack stack)`
- `public int getMaxDamage( ItemStack stack)`
- `public boolean isDamaged( ItemStack stack)`
- `public void setDamage( ItemStack stack, int damage)`
- `public boolean canHarvestBlock( IBlockState state, ItemStack stack)`
- `public int getItemStackLimit( ItemStack stack)`
- `public void setHarvestLevel(java.lang.String toolClass, int level)`
- `public java.util.Set<java.lang.String> getToolClasses( ItemStack stack)`
- `@Deprecated public int getHarvestLevel( ItemStack stack, java.lang.String toolClass)`
- `public int getHarvestLevel( ItemStack stack, java.lang.String toolClass, @Nullable EntityPlayer player, @Nullable IBlockState blockState)`
- `public int getItemEnchantability( ItemStack stack)`
- `public boolean isBeaconPayment( ItemStack stack)`
- `public boolean shouldCauseReequipAnimation( ItemStack oldStack, ItemStack newStack, boolean slotChanged)`
- `public boolean shouldCauseBlockBreakReset( ItemStack oldStack, ItemStack newStack)`
- `public ICapabilityProvider initCapabilities( ItemStack stack, NBTTagCompound nbt)`
- `public com.google.common.collect.ImmutableMap<java.lang.String, ITimeValue > getAnimationParameters( ItemStack stack, World world, EntityLivingBase entity)`
- `public static void registerItems()`
- `protected static void registerItemBlock( Block blockIn, Item itemIn)`

## Description

ItemStack sensitive version of canHarvestBlock(IBlockState)
