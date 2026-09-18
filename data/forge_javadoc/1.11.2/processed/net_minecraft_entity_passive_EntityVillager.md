# EntityVillager

## Class signature

```java
public class EntityVillager extends EntityAgeable implements INpc , IMerchant
```

## Constructors

- `public EntityVillager( World worldIn)`
- `public EntityVillager( World worldIn, int professionId)`

## Methods

- `protected void initEntityAI()`
- `protected void onGrowingAdult()`
- `protected void applyEntityAttributes()`
- `protected void updateAITasks()`
- `public boolean processInteract( EntityPlayer player, EnumHand hand)`
- `protected void entityInit()`
- `public static void registerFixesVillager( DataFixer fixer)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `protected boolean canDespawn()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `@Nullable protected ResourceLocation getLootTable()`
- `public void setProfession(int professionId)`
- `@Deprecated public int getProfession()`
- `public void setProfession( VillagerRegistry.VillagerProfession prof)`
- `public VillagerRegistry.VillagerProfession getProfessionForge()`
- `public void notifyDataManagerChange( DataParameter <?> key)`
- `public boolean isMating()`
- `public void setMating(boolean mating)`
- `public void setPlaying(boolean playing)`
- `public boolean isPlaying()`
- `public void setRevengeTarget(@Nullable EntityLivingBase livingBase)`
- `public void onDeath( DamageSource cause)`
- `public void setCustomer( EntityPlayer player)`
- `public EntityPlayer getCustomer()`
- `public boolean isTrading()`
- `public boolean getIsWillingToMate(boolean updateFirst)`
- `public void setIsWillingToMate(boolean isWillingToMate)`
- `public void useRecipe( MerchantRecipe recipe)`
- `public void verifySellingItem( ItemStack stack)`
- `@Nullable public MerchantRecipeList getRecipes( EntityPlayer player)`
- `public void setRecipes(@Nullable MerchantRecipeList recipeList)`
- `public World getWorld()`
- `public BlockPos getPos()`
- `public ITextComponent getDisplayName()`
- `public float getEyeHeight()`
- `public void handleStatusUpdate(byte id)`
- `@Nullable public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, @Nullable IEntityLivingData livingdata)`
- `public IEntityLivingData finalizeMobSpawn( DifficultyInstance p_190672_1_, @Nullable IEntityLivingData p_190672_2_, boolean p_190672_3_)`
- `public void setLookingForHome()`
- `public EntityVillager createChild( EntityAgeable ageable)`
- `public boolean canBeLeashedTo( EntityPlayer player)`
- `public void onStruckByLightning( EntityLightningBolt lightningBolt)`
- `public InventoryBasic getVillagerInventory()`
- `protected void updateEquipmentIfNeeded( EntityItem itemEntity)`
- `public boolean hasEnoughFoodToBreed()`
- `public boolean canAbondonItems()`
- `public boolean wantsMoreFood()`
- `public boolean isFarmItemInInventory()`
- `public boolean replaceItemInInventory(int inventorySlot, ItemStack itemStackIn)`
- `public static EntityVillager.ITradeList [][][][] GET_TRADES_DONT_USE()`

## Description

Deprecated.