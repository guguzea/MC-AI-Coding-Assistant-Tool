# EntityVillager

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.EntityAgeable → net.minecraft.entity.passive.EntityVillager

## Class signature

```java
public class EntityVillager extends EntityAgeable implements IMerchant, INpc
```

## Methods

- `protected void applyEntityAttributes()`
- `boolean canAbondonItems()`
- `boolean canBeLeashedTo(EntityPlayer player)`
- `protected boolean canDespawn()`
- `EntityVillager createChild(EntityAgeable ageable)`
- `protected void entityInit()`
- `static EntityVillager.ITradeList [][][][] GET_TRADES_DONT_USE()`
- `protected SoundEvent getAmbientSound()`
- `EntityPlayer getCustomer()`
- `protected SoundEvent getDeathSound()`
- `ITextComponent getDisplayName()`
- `float getEyeHeight()`
- `protected SoundEvent getHurtSound()`
- `boolean getIsWillingToMate(boolean updateFirst)`
- `@Deprecated int getProfession()`
- `VillagerRegistry.VillagerProfession getProfessionForge()`
- `MerchantRecipeList getRecipes(EntityPlayer player)`
- `InventoryBasic getVillagerInventory()`
- `void handleStatusUpdate(byte id)`
- `boolean hasEnoughFoodToBreed()`
- `protected void initEntityAI()`
- `boolean isFarmItemInInventory()`
- `boolean isMating()`
- `boolean isPlaying()`
- `boolean isTrading()`
- `void notifyDataManagerChange(DataParameter<?> key)`
- `void onDeath(DamageSource cause)`
- `protected void onGrowingAdult()`
- `IEntityLivingData onInitialSpawn(DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `void onStruckByLightning(EntityLightningBolt lightningBolt)`
- `boolean processInteract(EntityPlayer player, EnumHand hand, ItemStack stack)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesVillager(DataFixer fixer)`
- `boolean replaceItemInInventory(int inventorySlot, ItemStack itemStackIn)`
- `void setCustomer(EntityPlayer player)`
- `void setIsWillingToMate(boolean willingToTrade)`
- `void setLookingForHome()`
- `void setMating(boolean mating)`
- `void setPlaying(boolean playing)`
- `void setProfession(int professionId)`
- `void setProfession(VillagerRegistry.VillagerProfession prof)`
- `void setRecipes(MerchantRecipeList recipeList)`
- `void setRevengeTarget(EntityLivingBase livingBase)`
- `protected void updateAITasks()`
- `protected void updateEquipmentIfNeeded(EntityItem itemEntity)`
- `void useRecipe(MerchantRecipe recipe)`
- `void verifySellingItem(ItemStack stack)`
- `boolean wantsMoreFood()`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `EntityVillager`
- `EntityVillager`