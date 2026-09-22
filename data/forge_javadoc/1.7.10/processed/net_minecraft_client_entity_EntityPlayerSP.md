# EntityPlayerSP

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.player.EntityPlayer → net.minecraft.client.entity.AbstractClientPlayer → net.minecraft.client.entity.EntityPlayerSP

## Class signature

```java
public class EntityPlayerSP extends AbstractClientPlayer
```

## Constructors

- `EntityPlayerSP(Minecraft p_i1238_1_, World p_i1238_2_, Session p_i1238_3_, int p_i1238_4_)`

## Methods

- `void addChatComponentMessage(IChatComponent p_146105_1_)`
- `void addChatMessage(IChatComponent p_145747_1_)`
- `boolean canCommandSenderUseCommand(int p_70003_1_, java.lang.String p_70003_2_)`
- `void closeScreen()`
- `void displayGUIAnvil(int p_82244_1_, int p_82244_2_, int p_82244_3_)`
- `void displayGUIBook(ItemStack p_71048_1_)`
- `void displayGUIChest(IInventory p_71007_1_)`
- `void displayGUIEnchantment(int p_71002_1_, int p_71002_2_, int p_71002_3_, java.lang.String p_71002_4_)`
- `void displayGUIHopperMinecart(EntityMinecartHopper p_96125_1_)`
- `void displayGUIHorse(EntityHorse p_110298_1_, IInventory p_110298_2_)`
- `void displayGUIMerchant(IMerchant p_71030_1_, java.lang.String p_71030_2_)`
- `void displayGUIWorkbench(int p_71058_1_, int p_71058_2_, int p_71058_3_)`
- `protected void func_110318_g()`
- `protected boolean func_145771_j(double p_145771_1_, double p_145771_3_, double p_145771_5_)`
- `void func_146093_a(TileEntityHopper p_146093_1_)`
- `void func_146095_a(CommandBlockLogic p_146095_1_)`
- `void func_146098_a(TileEntityBrewingStand p_146098_1_)`
- `void func_146100_a(TileEntity p_146100_1_)`
- `void func_146101_a(TileEntityFurnace p_146101_1_)`
- `void func_146102_a(TileEntityDispenser p_146102_1_)`
- `void func_146104_a(TileEntityBeacon p_146104_1_)`
- `float getFOVMultiplier()`
- `float getHorseJumpPower()`
- `ChunkCoordinates getPlayerCoordinates()`
- `boolean isClientWorld()`
- `boolean isRidingHorse()`
- `boolean isSneaking()`
- `void onCriticalHit(Entity p_71009_1_)`
- `void onEnchantmentCritical(Entity p_71047_1_)`
- `void onItemPickup(Entity p_71001_1_, int p_71001_2_)`
- `void onLivingUpdate()`
- `void playSound(java.lang.String p_85030_1_, float p_85030_2_, float p_85030_3_)`
- `void setPlayerSPHealth(float p_71150_1_)`
- `void setSprinting(boolean p_70031_1_)`
- `void setXPStats(float p_71152_1_, int p_71152_2_, int p_71152_3_)`
- `void updateEntityActionState()`

## Fields

- `protected Minecraft mc`
- `MovementInput movementInput`
- `float prevRenderArmPitch`
- `float prevRenderArmYaw`
- `float prevTimeInPortal`
- `float renderArmPitch`
- `float renderArmYaw`
- `int sprintingTicksLeft`
- `protected int sprintToggleTimer`
- `float timeInPortal`