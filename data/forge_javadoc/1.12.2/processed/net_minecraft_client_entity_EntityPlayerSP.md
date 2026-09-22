# EntityPlayerSP

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.player.EntityPlayer → net.minecraft.client.entity.AbstractClientPlayer → net.minecraft.client.entity.EntityPlayerSP

## Class signature

```java
public class EntityPlayerSP extends AbstractClientPlayer
```

## Constructors

- `EntityPlayerSP(Minecraft p_i47378_1_, World p_i47378_2_, NetHandlerPlayClient p_i47378_3_, StatisticsManager p_i47378_4_, RecipeBook p_i47378_5_)`

## Methods

- `void addStat(StatBase stat, int amount)`
- `boolean attackEntityFrom(DamageSource source, float amount)`
- `boolean canUseCommand(int permLevel, java.lang.String commandName)`
- `void closeScreen()`
- `void closeScreenAndDropStack()`
- `protected void damageEntity(DamageSource damageSrc, float damageAmount)`
- `void dismountRidingEntity()`
- `void displayGui(IInteractionObject guiOwner)`
- `void displayGUIChest(IInventory chestInventory)`
- `void displayGuiCommandBlock(TileEntityCommandBlock commandBlock)`
- `void displayGuiEditCommandCart(CommandBlockBaseLogic commandBlock)`
- `void displayVillagerTradeGui(IMerchant villager)`
- `EntityItem dropItem(boolean dropAll)`
- `ItemStack dropItemAndGetStack(EntityItem p_184816_1_)`
- `EnumHand getActiveHand()`
- `float getHorseJumpPower()`
- `Vec3d getLook(float partialTicks)`
- `int getPermissionLevel()`
- `BlockPos getPosition()`
- `RecipeBook getRecipeBook()`
- `java.lang.String getServerBrand()`
- `StatisticsManager getStatFileWriter()`
- `void handleStatusUpdate(byte id)`
- `void heal(float healAmount)`
- `boolean isAutoJumpEnabled()`
- `protected boolean isCurrentViewEntity()`
- `boolean isHandActive()`
- `boolean isRidingHorse()`
- `boolean isRowingBoat()`
- `boolean isServerWorld()`
- `boolean isSneaking()`
- `boolean isUser()`
- `void move(MoverType type, double x, double y, double z)`
- `void notifyDataManagerChange(DataParameter<?> key)`
- `void onCriticalHit(Entity entityHit)`
- `void onEnchantmentCritical(Entity entityHit)`
- `void onLivingUpdate()`
- `void onUpdate()`
- `void openBook(ItemStack stack, EnumHand hand)`
- `void openEditSign(TileEntitySign signTile)`
- `void openEditStructure(TileEntityStructure structure)`
- `void openGuiHorseInventory(AbstractHorse horse, IInventory inventoryIn)`
- `void playSound(SoundEvent soundIn, float volume, float pitch)`
- `protected boolean pushOutOfBlocks(double x, double y, double z)`
- `PotionEffect removeActivePotionEffect(Potion potioneffectin)`
- `void removeRecipeHighlight(IRecipe p_193103_1_)`
- `void resetActiveHand()`
- `void respawnPlayer()`
- `void sendChatMessage(java.lang.String message)`
- `void sendHorseInventory()`
- `protected void sendHorseJump()`
- `void sendMessage(ITextComponent component)`
- `void sendPlayerAbilities()`
- `void sendStatusMessage(ITextComponent chatComponent, boolean actionBar)`
- `void setActiveHand(EnumHand hand)`
- `void setPermissionLevel(int p_184839_1_)`
- `void setPlayerSPHealth(float health)`
- `void setServerBrand(java.lang.String brand)`
- `void setSprinting(boolean sprinting)`
- `void setXPStats(float currentXP, int maxXP, int level)`
- `boolean startRiding(Entity entityIn, boolean force)`
- `void swingArm(EnumHand hand)`
- `protected void updateAutoJump(float p_189810_1_, float p_189810_2_)`
- `void updateEntityActionState()`
- `void updateRidden()`
- `void updateSyncFields(EntityPlayerSP old)`

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