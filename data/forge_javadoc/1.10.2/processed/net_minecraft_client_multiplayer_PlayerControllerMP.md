# PlayerControllerMP

## Class signature

```java
public class PlayerControllerMP extends java.lang.Object
```

## Constructors

- `public PlayerControllerMP( Minecraft mcIn, NetHandlerPlayClient netHandler)`

## Methods

- `public static void clickBlockCreative( Minecraft mcIn, PlayerControllerMP playerController, BlockPos pos, EnumFacing facing)`
- `public void setPlayerCapabilities( EntityPlayer player)`
- `public boolean isSpectator()`
- `public void setGameType( GameType type)`
- `public void flipPlayer( EntityPlayer playerIn)`
- `public boolean shouldDrawHUD()`
- `public boolean onPlayerDestroyBlock( BlockPos pos)`
- `public boolean clickBlock( BlockPos loc, EnumFacing face)`
- `public void resetBlockRemoving()`
- `public boolean onPlayerDamageBlock( BlockPos posBlock, EnumFacing directionFacing)`
- `public float getBlockReachDistance()`
- `public void updateController()`
- `public EnumActionResult processRightClickBlock( EntityPlayerSP player, WorldClient worldIn, @Nullable ItemStack stack, BlockPos pos, EnumFacing facing, Vec3d vec, EnumHand hand)`
- `public EnumActionResult processRightClick( EntityPlayer player, World worldIn, ItemStack stack, EnumHand hand)`
- `public EntityPlayerSP createClientPlayer( World worldIn, StatisticsManager statWriter)`
- `public void attackEntity( EntityPlayer playerIn, Entity targetEntity)`
- `public EnumActionResult interactWithEntity( EntityPlayer player, Entity target, @Nullable ItemStack heldItem, EnumHand hand)`
- `public EnumActionResult interactWithEntity( EntityPlayer player, Entity target, RayTraceResult raytrace, @Nullable ItemStack heldItem, EnumHand hand)`
- `public ItemStack windowClick(int windowId, int slotId, int mouseButton, ClickType type, EntityPlayer player)`
- `public void sendEnchantPacket(int windowID, int button)`
- `public void sendSlotPacket( ItemStack itemStackIn, int slotId)`
- `public void sendPacketDropItem( ItemStack itemStackIn)`
- `public void onStoppedUsingItem( EntityPlayer playerIn)`
- `public boolean gameIsSurvivalOrAdventure()`
- `public boolean isNotCreative()`
- `public boolean isInCreativeMode()`
- `public boolean extendedReach()`
- `public boolean isRidingHorse()`
- `public boolean isSpectatorMode()`
- `public GameType getCurrentGameType()`
- `public boolean getIsHittingBlock()`
- `public void pickItem(int index)`