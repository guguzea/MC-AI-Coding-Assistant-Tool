# EntityPlayerSP.html#playSound-net.minecraft.util.SoundEvent-float-float-

## Class signature

```java
public class EntityPlayerSP extends AbstractClientPlayer
```

## Methods

- `public EntityPlayerSP( Minecraft mcIn, World worldIn, NetHandlerPlayClient netHandler, StatisticsManager statFile)`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public void heal(float healAmount)`
- `public boolean startRiding( Entity entityIn, boolean force)`
- `public void dismountRidingEntity()`
- `public void onUpdate()`
- `public void onUpdateWalkingPlayer()`
- `@Nullable public EntityItem dropItem(boolean dropAll)`
- `@Nullable public ItemStack dropItemAndGetStack( EntityItem p_184816_1_)`
- `public void sendChatMessage(java.lang.String message)`
- `public void swingArm( EnumHand hand)`
- `public void respawnPlayer()`
- `protected void damageEntity( DamageSource damageSrc, float damageAmount)`
- `public void closeScreen()`
- `public void closeScreenAndDropStack()`
- `public void setPlayerSPHealth(float health)`
- `public void addStat( StatBase stat, int amount)`
- `public void sendPlayerAbilities()`
- `public boolean isUser()`
- `protected void sendHorseJump()`
- `public void sendHorseInventory()`
- `public void setServerBrand(java.lang.String brand)`
- `public java.lang.String getServerBrand()`
- `public StatisticsManager getStatFileWriter()`
- `public int getPermissionLevel()`
- `public void setPermissionLevel(int p_184839_1_)`
- `public void addChatComponentMessage( ITextComponent chatComponent)`
- `protected boolean pushOutOfBlocks(double x, double y, double z)`
- `public void setSprinting(boolean sprinting)`
- `public void setXPStats(float currentXP, int maxXP, int level)`
- `public void addChatMessage( ITextComponent component)`
- `public boolean canCommandSenderUseCommand(int permLevel, java.lang.String commandName)`
- `public void handleStatusUpdate(byte id)`
- `public BlockPos getPosition()`
- `public void playSound( SoundEvent soundIn, float volume, float pitch)`
- `public boolean isServerWorld()`
- `public void setActiveHand( EnumHand hand)`
- `public boolean isHandActive()`
- `public void resetActiveHand()`
- `public EnumHand getActiveHand()`
- `public void notifyDataManagerChange( DataParameter <?> key)`
- `public boolean isRidingHorse()`
- `public float getHorseJumpPower()`
- `public void openEditSign( TileEntitySign signTile)`
- `public void displayGuiEditCommandCart( CommandBlockBaseLogic commandBlock)`
- `public void displayGuiCommandBlock( TileEntityCommandBlock commandBlock)`
- `public void openEditStructure( TileEntityStructure structure)`
- `public void openBook( ItemStack stack, EnumHand hand)`
- `public void displayGUIChest( IInventory chestInventory)`
- `public void openGuiHorseInventory( EntityHorse horse, IInventory inventoryIn)`
- `public void displayGui( IInteractionObject guiOwner)`
- `public void displayVillagerTradeGui( IMerchant villager)`
- `public void onCriticalHit( Entity entityHit)`
- `public void onEnchantmentCritical( Entity entityHit)`
- `public boolean isSneaking()`
- `public void updateEntityActionState()`
- `protected boolean isCurrentViewEntity()`
- `public void onLivingUpdate()`
- `public void updateRidden()`
- `public boolean isRowingBoat()`
- `@Nullable public PotionEffect removeActivePotionEffect(@Nullable Potion potioneffectin)`
- `public void moveEntity(double x, double y, double z)`
- `public boolean isAutoJumpEnabled()`
- `protected void updateAutoJump(float p_189810_1_, float p_189810_2_)`