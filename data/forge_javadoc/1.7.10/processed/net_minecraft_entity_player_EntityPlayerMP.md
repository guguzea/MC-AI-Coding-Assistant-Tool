# EntityPlayerMP

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.player.EntityPlayer → net.minecraft.entity.player.EntityPlayerMP

## Class signature

```java
public class EntityPlayerMP extends EntityPlayer implements ICrafting
```

## Constructors

- `EntityPlayerMP(MinecraftServer p_i45285_1_, WorldServer p_i45285_2_, GameProfile p_i45285_3_, ItemInWorldManager p_i45285_4_)`

## Methods

- `void addChatComponentMessage(IChatComponent p_146105_1_)`
- `void addChatMessage(IChatComponent p_145747_1_)`
- `void addExperienceLevel(int p_82242_1_)`
- `void addSelfToInternalCraftingInventory()`
- `void addStat(StatBase p_71064_1_, int p_71064_2_)`
- `boolean attackEntityFrom(DamageSource p_70097_1_, float p_70097_2_)`
- `boolean canAttackPlayer(EntityPlayer p_96122_1_)`
- `boolean canCommandSenderUseCommand(int p_70003_1_, java.lang.String p_70003_2_)`
- `void clonePlayer(EntityPlayer p_71049_1_, boolean p_71049_2_)`
- `void closeContainer()`
- `void closeScreen()`
- `void displayGUIAnvil(int p_82244_1_, int p_82244_2_, int p_82244_3_)`
- `void displayGUIChest(IInventory p_71007_1_)`
- `void displayGUIEnchantment(int p_71002_1_, int p_71002_2_, int p_71002_3_, java.lang.String p_71002_4_)`
- `void displayGUIHopperMinecart(EntityMinecartHopper p_96125_1_)`
- `void displayGUIHorse(EntityHorse p_110298_1_, IInventory p_110298_2_)`
- `void displayGUIMerchant(IMerchant p_71030_1_, java.lang.String p_71030_2_)`
- `void displayGUIWorkbench(int p_71058_1_, int p_71058_2_, int p_71058_3_)`
- `void func_143004_u()`
- `void func_146093_a(TileEntityHopper p_146093_1_)`
- `void func_146098_a(TileEntityBrewingStand p_146098_1_)`
- `void func_146100_a(TileEntity p_146100_1_)`
- `void func_146101_a(TileEntityFurnace p_146101_1_)`
- `void func_146102_a(TileEntityDispenser p_146102_1_)`
- `void func_146104_a(TileEntityBeacon p_146104_1_)`
- `EntityPlayer.EnumChatVisibility func_147096_v()`
- `protected void func_147098_j()`
- `StatisticsFile func_147099_x()`
- `void func_147100_a(C15PacketClientSettings p_147100_1_)`
- `void func_152339_d(Entity p_152339_1_)`
- `long func_154331_x()`
- `float getEyeHeight()`
- `void getNextWindowId()`
- `ChunkCoordinates getPlayerCoordinates()`
- `java.lang.String getPlayerIP()`
- `WorldServer getServerForPlayer()`
- `void handleFalling(double p_71122_1_, boolean p_71122_3_)`
- `void mountEntity(Entity p_70078_1_)`
- `void mountEntityAndWakeUp()`
- `protected void onChangedPotionEffect(PotionEffect p_70695_1_, boolean p_70695_2_)`
- `void onCriticalHit(Entity p_71009_1_)`
- `void onDeath(DamageSource p_70645_1_)`
- `void onEnchantmentCritical(Entity p_71047_1_)`
- `protected void onFinishedPotionEffect(PotionEffect p_70688_1_)`
- `void onItemPickup(Entity p_71001_1_, int p_71001_2_)`
- `protected void onItemUseFinish()`
- `protected void onNewPotionEffect(PotionEffect p_70670_1_)`
- `void onUpdate()`
- `void onUpdateEntity()`
- `void readEntityFromNBT(NBTTagCompound p_70037_1_)`
- `void requestTexturePackLoad(java.lang.String p_147095_1_)`
- `protected void resetHeight()`
- `void sendContainerAndContentsToPlayer(Container p_71110_1_, java.util.List p_71110_2_)`
- `void sendContainerToPlayer(Container p_71120_1_)`
- `void sendPlayerAbilities()`
- `void sendProgressBarUpdate(Container p_71112_1_, int p_71112_2_, int p_71112_3_)`
- `void sendSlotContents(Container p_71111_1_, int p_71111_2_, ItemStack p_71111_3_)`
- `void setEntityActionState(float p_110430_1_, float p_110430_2_, boolean p_110430_3_, boolean p_110430_4_)`
- `void setGameType(WorldSettings.GameType p_71033_1_)`
- `void setItemInUse(ItemStack p_71008_1_, int p_71008_2_)`
- `void setPlayerHealthUpdated()`
- `void setPositionAndUpdate(double p_70634_1_, double p_70634_3_, double p_70634_5_)`
- `EntityPlayer.EnumStatus sleepInBedAt(int p_71018_1_, int p_71018_2_, int p_71018_3_)`
- `void travelToDimension(int p_71027_1_)`
- `protected void updateFallState(double p_70064_1_, boolean p_70064_3_)`
- `void updateHeldItem()`
- `void wakeUpPlayer(boolean p_70999_1_, boolean p_70999_2_, boolean p_70999_3_)`
- `void writeEntityToNBT(NBTTagCompound p_70014_1_)`

## Fields

- `int currentWindowId`
- `boolean isChangingQuantityOnly`
- `java.util.List loadedChunks`
- `double managedPosX`
- `double managedPosZ`
- `MinecraftServer mcServer`
- `int ping`
- `boolean playerConqueredTheEnd`
- `NetHandlerPlayServer playerNetServerHandler`
- `ItemInWorldManager theItemInWorldManager`