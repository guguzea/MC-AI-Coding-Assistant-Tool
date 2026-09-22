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
- `EntityPlayerSP createPlayer(World p_192830_1_, StatisticsManager p_192830_2_, RecipeBook p_192830_3_)`
- `boolean extendedReach()`
- `void flipPlayer(EntityPlayer playerIn)`
- `void func_194338_a(int p_194338_1_, IRecipe p_194338_2_, boolean p_194338_3_, EntityPlayer p_194338_4_)`
- `boolean gameIsSurvivalOrAdventure()`
- `float getBlockReachDistance()`
- `GameType getCurrentGameType()`
- `boolean getIsHittingBlock()`
- `EnumActionResult interactWithEntity(EntityPlayer player, Entity target, EnumHand hand)`
- `EnumActionResult interactWithEntity(EntityPlayer player, Entity target, RayTraceResult ray, EnumHand hand)`
- `boolean isInCreativeMode()`
- `boolean isNotCreative()`
- `boolean isRidingHorse()`
- `boolean isSpectator()`
- `boolean isSpectatorMode()`
- `boolean onPlayerDamageBlock(BlockPos posBlock, EnumFacing directionFacing)`
- `boolean onPlayerDestroyBlock(BlockPos pos)`
- `void onStoppedUsingItem(EntityPlayer playerIn)`
- `void pickItem(int index)`
- `EnumActionResult processRightClick(EntityPlayer player, World worldIn, EnumHand hand)`
- `EnumActionResult processRightClickBlock(EntityPlayerSP player, WorldClient worldIn, BlockPos pos, EnumFacing direction, Vec3d vec, EnumHand hand)`
- `void resetBlockRemoving()`
- `void sendEnchantPacket(int windowID, int button)`
- `void sendPacketDropItem(ItemStack itemStackIn)`
- `void sendSlotPacket(ItemStack itemStackIn, int slotId)`
- `void setGameType(GameType type)`
- `void setPlayerCapabilities(EntityPlayer player)`
- `boolean shouldDrawHUD()`
- `void updateController()`
- `ItemStack windowClick(int windowId, int slotId, int mouseButton, ClickType type, EntityPlayer player)`