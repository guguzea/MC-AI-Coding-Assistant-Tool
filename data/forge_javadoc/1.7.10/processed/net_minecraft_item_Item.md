# Item

## Class signature

```java
public class Item extends java.lang.Object
```

## Constructors

- `public Item()`

## Methods

- `public static int getIdFromItem( Item p_150891_0_)`
- `public static Item getItemById(int p_150899_0_)`
- `public static Item getItemFromBlock( Block p_150898_0_)`
- `public static void registerItems()`
- `public Item setMaxStackSize(int p_77625_1_)`
- `public int getSpriteNumber()`
- `public IIcon getIconFromDamage(int p_77617_1_)`
- `public IIcon getIconIndex( ItemStack p_77650_1_)`
- `public boolean onItemUse( ItemStack p_77648_1_, EntityPlayer p_77648_2_, World p_77648_3_, int p_77648_4_, int p_77648_5_, int p_77648_6_, int p_77648_7_, float p_77648_8_, float p_77648_9_, float p_77648_10_)`
- `public float func_150893_a( ItemStack p_150893_1_, Block p_150893_2_)`
- `public ItemStack onItemRightClick( ItemStack p_77659_1_, World p_77659_2_, EntityPlayer p_77659_3_)`
- `public ItemStack onEaten( ItemStack p_77654_1_, World p_77654_2_, EntityPlayer p_77654_3_)`
- `public int getItemStackLimit()`
- `public int getMetadata(int p_77647_1_)`
- `public boolean getHasSubtypes()`
- `public Item setHasSubtypes(boolean p_77627_1_)`
- `public int getMaxDamage()`
- `public Item setMaxDamage(int p_77656_1_)`
- `public boolean isDamageable()`
- `public boolean hitEntity( ItemStack p_77644_1_, EntityLivingBase p_77644_2_, EntityLivingBase p_77644_3_)`
- `public boolean onBlockDestroyed( ItemStack p_150894_1_, World p_150894_2_, Block p_150894_3_, int p_150894_4_, int p_150894_5_, int p_150894_6_, EntityLivingBase p_150894_7_)`
- `public boolean func_150897_b( Block p_150897_1_)`
- `public boolean itemInteractionForEntity( ItemStack p_111207_1_, EntityPlayer p_111207_2_, EntityLivingBase p_111207_3_)`
- `public Item setFull3D()`
- `public boolean isFull3D()`
- `public boolean shouldRotateAroundWhenRendering()`
- `public Item setUnlocalizedName(java.lang.String p_77655_1_)`
- `public java.lang.String getUnlocalizedNameInefficiently( ItemStack p_77657_1_)`
- `public java.lang.String getUnlocalizedName()`
- `public java.lang.String getUnlocalizedName( ItemStack p_77667_1_)`
- `public Item setContainerItem( Item p_77642_1_)`
- `public boolean doesContainerItemLeaveCraftingGrid( ItemStack p_77630_1_)`
- `public boolean getShareTag()`
- `public Item getContainerItem()`
- `public boolean hasContainerItem()`
- `public int getColorFromItemStack( ItemStack p_82790_1_, int p_82790_2_)`
- `public void onUpdate( ItemStack p_77663_1_, World p_77663_2_, Entity p_77663_3_, int p_77663_4_, boolean p_77663_5_)`
- `public void onCreated( ItemStack p_77622_1_, World p_77622_2_, EntityPlayer p_77622_3_)`
- `public boolean isMap()`
- `public EnumAction getItemUseAction( ItemStack p_77661_1_)`
- `public int getMaxItemUseDuration( ItemStack p_77626_1_)`
- `public void onPlayerStoppedUsing( ItemStack p_77615_1_, World p_77615_2_, EntityPlayer p_77615_3_, int p_77615_4_)`
- `public Item setPotionEffect(java.lang.String p_77631_1_)`
- `public java.lang.String getPotionEffect( ItemStack p_150896_1_)`
- `public boolean isPotionIngredient( ItemStack p_150892_1_)`
- `public void addInformation( ItemStack p_77624_1_, EntityPlayer p_77624_2_, java.util.List p_77624_3_, boolean p_77624_4_)`
- `public java.lang.String getItemStackDisplayName( ItemStack p_77653_1_)`
- `public boolean hasEffect( ItemStack p_77636_1_)`
- `public EnumRarity getRarity( ItemStack p_77613_1_)`
- `public boolean isItemTool( ItemStack p_77616_1_)`
- `protected MovingObjectPosition getMovingObjectPositionFromPlayer( World p_77621_1_, EntityPlayer p_77621_2_, boolean p_77621_3_)`
- `public int getItemEnchantability()`
- `public boolean requiresMultipleRenderPasses()`
- `public IIcon getIconFromDamageForRenderPass(int p_77618_1_, int p_77618_2_)`
- `public void getSubItems( Item p_150895_1_, CreativeTabs p_150895_2_, java.util.List p_150895_3_)`
- `public Item setCreativeTab( CreativeTabs p_77637_1_)`
- `public CreativeTabs getCreativeTab()`
- `public boolean canItemEditBlocks()`
- `public boolean getIsRepairable( ItemStack p_82789_1_, ItemStack p_82789_2_)`
- `public void registerIcons( IIconRegister p_94581_1_)`
- `public Multimap getItemAttributeModifiers()`
- `public Item setTextureName(java.lang.String p_111206_1_)`
- `protected java.lang.String getIconString()`