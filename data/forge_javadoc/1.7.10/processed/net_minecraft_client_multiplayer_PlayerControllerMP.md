# PlayerControllerMP

**Inheritance:** java.lang.Object → net.minecraft.client.multiplayer.PlayerControllerMP

## Class signature

```java
public class PlayerControllerMP extends java.lang.Object
```

## Constructors

- `PlayerControllerMP(Minecraft p_i45062_1_, NetHandlerPlayClient p_i45062_2_)`

## Methods

- `void attackEntity(EntityPlayer p_78764_1_, Entity p_78764_2_)`
- `void clickBlock(int p_78743_1_, int p_78743_2_, int p_78743_3_, int p_78743_4_)`
- `static void clickBlockCreative(Minecraft p_78744_0_, PlayerControllerMP p_78744_1_, int p_78744_2_, int p_78744_3_, int p_78744_4_, int p_78744_5_)`
- `boolean enableEverythingIsScrewedUpMode()`
- `boolean extendedReach()`
- `void flipPlayer(EntityPlayer p_78745_1_)`
- `boolean func_110738_j()`
- `EntityClientPlayerMP func_147493_a(World p_147493_1_, StatFileWriter p_147493_2_)`
- `boolean gameIsSurvivalOrAdventure()`
- `float getBlockReachDistance()`
- `boolean interactWithEntitySendPacket(EntityPlayer p_78768_1_, Entity p_78768_2_)`
- `boolean isInCreativeMode()`
- `boolean isNotCreative()`
- `void onPlayerDamageBlock(int p_78759_1_, int p_78759_2_, int p_78759_3_, int p_78759_4_)`
- `boolean onPlayerDestroyBlock(int p_78751_1_, int p_78751_2_, int p_78751_3_, int p_78751_4_)`
- `boolean onPlayerRightClick(EntityPlayer p_78760_1_, World p_78760_2_, ItemStack p_78760_3_, int p_78760_4_, int p_78760_5_, int p_78760_6_, int p_78760_7_, Vec3 p_78760_8_)`
- `void onStoppedUsingItem(EntityPlayer p_78766_1_)`
- `void resetBlockRemoving()`
- `void sendEnchantPacket(int p_78756_1_, int p_78756_2_)`
- `void sendPacketDropItem(ItemStack p_78752_1_)`
- `void sendSlotPacket(ItemStack p_78761_1_, int p_78761_2_)`
- `boolean sendUseItem(EntityPlayer p_78769_1_, World p_78769_2_, ItemStack p_78769_3_)`
- `void setGameType(WorldSettings.GameType p_78746_1_)`
- `void setPlayerCapabilities(EntityPlayer p_78748_1_)`
- `boolean shouldDrawHUD()`
- `void updateController()`
- `ItemStack windowClick(int p_78753_1_, int p_78753_2_, int p_78753_3_, int p_78753_4_, EntityPlayer p_78753_5_)`