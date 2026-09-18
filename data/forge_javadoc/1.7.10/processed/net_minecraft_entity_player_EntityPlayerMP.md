# EntityPlayerMP

## Class signature

```java
public class EntityPlayerMP extends EntityPlayer implements ICrafting
```

## Constructors

- `public EntityPlayerMP( MinecraftServer p_i45285_1_, WorldServer p_i45285_2_, GameProfile p_i45285_3_, ItemInWorldManager p_i45285_4_)`

## Methods

- `public void readEntityFromNBT( NBTTagCompound p_70037_1_)`
- `public void writeEntityToNBT( NBTTagCompound p_70014_1_)`
- `public void addExperienceLevel(int p_82242_1_)`
- `public void addSelfToInternalCraftingInventory()`
- `protected void resetHeight()`
- `public float getEyeHeight()`
- `public void onUpdate()`
- `public void onUpdateEntity()`
- `protected void func_147098_j()`
- `public void onDeath( DamageSource p_70645_1_)`
- `public boolean attackEntityFrom( DamageSource p_70097_1_, float p_70097_2_)`
- `public boolean canAttackPlayer( EntityPlayer p_96122_1_)`
- `public void travelToDimension(int p_71027_1_)`
- `public void onItemPickup( Entity p_71001_1_, int p_71001_2_)`
- `public EntityPlayer.EnumStatus sleepInBedAt(int p_71018_1_, int p_71018_2_, int p_71018_3_)`
- `public void wakeUpPlayer(boolean p_70999_1_, boolean p_70999_2_, boolean p_70999_3_)`
- `public void mountEntity( Entity p_70078_1_)`
- `protected void updateFallState(double p_70064_1_, boolean p_70064_3_)`
- `public void handleFalling(double p_71122_1_, boolean p_71122_3_)`
- `public void func_146100_a( TileEntity p_146100_1_)`
- `public void getNextWindowId()`
- `public void displayGUIWorkbench(int p_71058_1_, int p_71058_2_, int p_71058_3_)`
- `public void displayGUIEnchantment(int p_71002_1_, int p_71002_2_, int p_71002_3_, java.lang.String p_71002_4_)`
- `public void displayGUIAnvil(int p_82244_1_, int p_82244_2_, int p_82244_3_)`
- `public void displayGUIChest( IInventory p_71007_1_)`
- `public void func_146093_a( TileEntityHopper p_146093_1_)`
- `public void displayGUIHopperMinecart( EntityMinecartHopper p_96125_1_)`
- `public void func_146101_a( TileEntityFurnace p_146101_1_)`
- `public void func_146102_a( TileEntityDispenser p_146102_1_)`
- `public void func_146098_a( TileEntityBrewingStand p_146098_1_)`
- `public void func_146104_a( TileEntityBeacon p_146104_1_)`
- `public void displayGUIMerchant( IMerchant p_71030_1_, java.lang.String p_71030_2_)`
- `public void displayGUIHorse( EntityHorse p_110298_1_, IInventory p_110298_2_)`
- `public void sendSlotContents( Container p_71111_1_, int p_71111_2_, ItemStack p_71111_3_)`
- `public void sendContainerToPlayer( Container p_71120_1_)`
- `public void sendContainerAndContentsToPlayer( Container p_71110_1_, java.util.List p_71110_2_)`
- `public void sendProgressBarUpdate( Container p_71112_1_, int p_71112_2_, int p_71112_3_)`
- `public void closeScreen()`
- `public void updateHeldItem()`
- `public void closeContainer()`
- `public void setEntityActionState(float p_110430_1_, float p_110430_2_, boolean p_110430_3_, boolean p_110430_4_)`
- `public void addStat( StatBase p_71064_1_, int p_71064_2_)`
- `public void mountEntityAndWakeUp()`
- `public void setPlayerHealthUpdated()`
- `public void addChatComponentMessage( IChatComponent p_146105_1_)`
- `protected void onItemUseFinish()`
- `public void setItemInUse( ItemStack p_71008_1_, int p_71008_2_)`
- `public void clonePlayer( EntityPlayer p_71049_1_, boolean p_71049_2_)`
- `protected void onNewPotionEffect( PotionEffect p_70670_1_)`
- `protected void onChangedPotionEffect( PotionEffect p_70695_1_, boolean p_70695_2_)`
- `protected void onFinishedPotionEffect( PotionEffect p_70688_1_)`
- `public void setPositionAndUpdate(double p_70634_1_, double p_70634_3_, double p_70634_5_)`
- `public void onCriticalHit( Entity p_71009_1_)`
- `public void onEnchantmentCritical( Entity p_71047_1_)`
- `public void sendPlayerAbilities()`
- `public WorldServer getServerForPlayer()`
- `public void setGameType( WorldSettings.GameType p_71033_1_)`
- `public void addChatMessage( IChatComponent p_145747_1_)`
- `public boolean canCommandSenderUseCommand(int p_70003_1_, java.lang.String p_70003_2_)`
- `public java.lang.String getPlayerIP()`
- `public void func_147100_a( C15PacketClientSettings p_147100_1_)`
- `public EntityPlayer.EnumChatVisibility func_147096_v()`
- `public void requestTexturePackLoad(java.lang.String p_147095_1_)`
- `public ChunkCoordinates getPlayerCoordinates()`
- `public void func_143004_u()`
- `public StatisticsFile func_147099_x()`
- `public void func_152339_d( Entity p_152339_1_)`
- `public long func_154331_x()`