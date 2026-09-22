# EntityPlayerSP

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.player.EntityPlayer → net.minecraft.client.entity.AbstractClientPlayer → net.minecraft.client.entity.EntityPlayerSP

## Class signature

```java
public class EntityPlayerSP extends AbstractClientPlayer
```

## Constructors

- `EntityPlayerSP(Minecraft mcIn, World worldIn, NetHandlerPlayClient netHandler, StatisticsManager statFile)`

## Methods

- `void addChatComponentMessage(ITextComponent chatComponent)`
- `void addChatMessage(ITextComponent component)`
- `void addStat(StatBase stat, int amount)`
- `boolean attackEntityFrom(DamageSource source, float amount)`
- `boolean canCommandSenderUseCommand(int permLevel, java.lang.String commandName)`
- `void closeScreen()`
- `void closeScreenAndDropStack()`
- `protected void damageEntity(DamageSource damageSrc, float damageAmount)`
- `void dismountRidingEntity()`
- `void displayGui(IInteractionObject guiOwner)`
- `void displayGUIChest(IInventory chestInventory)`
- `void displayGuiCommandBlock(TileEntityCommandBlock p_184824_1_)`
- `void displayGuiEditCommandCart(CommandBlockBaseLogic p_184809_1_)`
- `void displayVillagerTradeGui(IMerchant villager)`
- `EntityItem dropItem(boolean dropAll)`
- `ItemStack dropItemAndGetStack(EntityItem p_184816_1_)`
- `EnumHand getActiveHand()`
- `float getHorseJumpPower()`
- `int getPermissionLevel()`
- `BlockPos getPosition()`
- `java.lang.String getServerBrand()`
- `StatisticsManager getStatFileWriter()`
- `void handleStatusUpdate(byte id)`
- `void heal(float healAmount)`
- `protected boolean isCurrentViewEntity()`
- `boolean isHandActive()`
- `boolean isRidingHorse()`
- `boolean isRowingBoat()`
- `boolean isServerWorld()`
- `boolean isSneaking()`
- `boolean isUser()`
- `void notifyDataManagerChange(DataParameter<?> key)`
- `void onCriticalHit(Entity entityHit)`
- `void onEnchantmentCritical(Entity entityHit)`
- `void onLivingUpdate()`
- `void onUpdate()`
- `void onUpdateWalkingPlayer()`
- `void openBook(ItemStack stack, EnumHand hand)`
- `void openEditSign(TileEntitySign signTile)`
- `void openGuiHorseInventory(EntityHorse horse, IInventory inventoryIn)`
- `void playSound(SoundEvent soundIn, float volume, float pitch)`
- `protected boolean pushOutOfBlocks(double x, double y, double z)`
- `PotionEffect removeActivePotionEffect(Potion potioneffectin)`
- `void resetActiveHand()`
- `void respawnPlayer()`
- `void sendChatMessage(java.lang.String message)`
- `void sendHorseInventory()`
- `protected void sendHorseJump()`
- `void sendPlayerAbilities()`
- `void setActiveHand(EnumHand hand)`
- `void setPermissionLevel(int p_184839_1_)`
- `void setPlayerSPHealth(float health)`
- `void setServerBrand(java.lang.String brand)`
- `void setSprinting(boolean sprinting)`
- `void setXPStats(float currentXP, int maxXP, int level)`
- `boolean startRiding(Entity entityIn, boolean force)`
- `void swingArm(EnumHand hand)`
- `void updateEntityActionState()`
- `void updateRidden()`

## Fields

- `NetHandlerPlayClient connection`
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