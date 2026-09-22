# PlayerControllerMP

**Inheritance:** java.lang.Object → net.minecraft.client.multiplayer.PlayerControllerMP

## Class signature

```java
public class PlayerControllerMP extends java.lang.Object
```

## Constructors

- `PlayerControllerMP(Minecraft mcIn, NetHandlerPlayClient netHandler)`

## Methods

- `void attackEntity(EntityPlayer playerIn, Entity targetEntity)`
- `boolean clickBlock(BlockPos loc, EnumFacing face)`
- `static void clickBlockCreative(Minecraft mcIn, PlayerControllerMP playerController, BlockPos pos, EnumFacing facing)`
- `EntityPlayerSP createClientPlayer(World worldIn, StatisticsManager statWriter)`
- `boolean extendedReach()`
- `void flipPlayer(EntityPlayer playerIn)`
- `boolean gameIsSurvivalOrAdventure()`
- `float getBlockReachDistance()`
- `WorldSettings.GameType getCurrentGameType()`
- `boolean getIsHittingBlock()`
- `EnumActionResult interactWithEntity(EntityPlayer player, Entity target, ItemStack heldItem, EnumHand hand)`
- `EnumActionResult interactWithEntity(EntityPlayer player, Entity target, RayTraceResult raytrace, ItemStack heldItem, EnumHand hand)`
- `boolean isInCreativeMode()`
- `boolean isNotCreative()`
- `boolean isRidingHorse()`
- `boolean isSpectator()`
- `boolean isSpectatorMode()`
- `boolean onPlayerDamageBlock(BlockPos posBlock, EnumFacing directionFacing)`
- `boolean onPlayerDestroyBlock(BlockPos pos)`
- `void onStoppedUsingItem(EntityPlayer playerIn)`
- `void pickItem(int index)`
- `EnumActionResult processRightClick(EntityPlayer player, World worldIn, ItemStack stack, EnumHand hand)`
- `EnumActionResult processRightClickBlock(EntityPlayerSP player, WorldClient worldIn, ItemStack stack, BlockPos pos, EnumFacing facing, Vec3d vec, EnumHand hand)`
- `void resetBlockRemoving()`
- `void sendEnchantPacket(int windowID, int button)`
- `void sendPacketDropItem(ItemStack itemStackIn)`
- `void sendSlotPacket(ItemStack itemStackIn, int slotId)`
- `void setGameType(WorldSettings.GameType type)`
- `void setPlayerCapabilities(EntityPlayer player)`
- `boolean shouldDrawHUD()`
- `void updateController()`
- `ItemStack windowClick(int windowId, int slotId, int mouseButton, ClickType type, EntityPlayer player)`