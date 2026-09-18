# PlayerControllerMP

## Class signature

```java
public class PlayerControllerMP extends java.lang.Object
```

## Constructors

- `public PlayerControllerMP( Minecraft mcIn, NetHandlerPlayClient p_i45062_2_)`

## Methods

- `public static void clickBlockCreative( Minecraft mcIn, PlayerControllerMP p_178891_1_, BlockPos p_178891_2_, EnumFacing p_178891_3_)`
- `public void setPlayerCapabilities( EntityPlayer p_78748_1_)`
- `public boolean isSpectator()`
- `public void setGameType( WorldSettings.GameType p_78746_1_)`
- `public void flipPlayer( EntityPlayer playerIn)`
- `public boolean shouldDrawHUD()`
- `public boolean onPlayerDestroyBlock( BlockPos pos, EnumFacing side)`
- `public boolean clickBlock( BlockPos loc, EnumFacing face)`
- `public void resetBlockRemoving()`
- `public boolean onPlayerDamageBlock( BlockPos posBlock, EnumFacing directionFacing)`
- `public float getBlockReachDistance()`
- `public void updateController()`
- `public boolean onPlayerRightClick( EntityPlayerSP player, WorldClient worldIn, ItemStack heldStack, BlockPos hitPos, EnumFacing side, Vec3 hitVec)`
- `public boolean sendUseItem( EntityPlayer playerIn, World worldIn, ItemStack itemStackIn)`
- `public EntityPlayerSP func_178892_a( World worldIn, StatFileWriter p_178892_2_)`
- `public void attackEntity( EntityPlayer playerIn, Entity targetEntity)`
- `public boolean interactWithEntitySendPacket( EntityPlayer playerIn, Entity targetEntity)`
- `public boolean func_178894_a( EntityPlayer p_178894_1_, Entity p_178894_2_, MovingObjectPosition p_178894_3_)`
- `public ItemStack windowClick(int windowId, int slotId, int mouseButtonClicked, int mode, EntityPlayer playerIn)`
- `public void sendEnchantPacket(int p_78756_1_, int p_78756_2_)`
- `public void sendSlotPacket( ItemStack itemStackIn, int slotId)`
- `public void sendPacketDropItem( ItemStack itemStackIn)`
- `public void onStoppedUsingItem( EntityPlayer playerIn)`
- `public boolean gameIsSurvivalOrAdventure()`
- `public boolean isNotCreative()`
- `public boolean isInCreativeMode()`
- `public boolean extendedReach()`
- `public boolean isRidingHorse()`
- `public boolean isSpectatorMode()`
- `public WorldSettings.GameType getCurrentGameType()`
- `public boolean func_181040_m()`

## Description

Attacks an entity