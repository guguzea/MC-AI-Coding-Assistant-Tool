# EntityPlayerSP

## Class signature

```java
public class EntityPlayerSP extends AbstractClientPlayer
```

## Constructors

- `public EntityPlayerSP( Minecraft mcIn, World worldIn, NetHandlerPlayClient netHandler, StatFileWriter statFile)`

## Methods

- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public void heal(float healAmount)`
- `public void mountEntity( Entity entityIn)`
- `public void onUpdate()`
- `public void onUpdateWalkingPlayer()`
- `public EntityItem dropOneItem(boolean dropAll)`
- `public void joinEntityItemWithWorld( EntityItem itemIn)`
- `public void sendChatMessage(java.lang.String message)`
- `public void swingItem()`
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
- `public void setClientBrand(java.lang.String brand)`
- `public java.lang.String getClientBrand()`
- `public StatFileWriter getStatFileWriter()`
- `public void addChatComponentMessage( IChatComponent chatComponent)`
- `protected boolean pushOutOfBlocks(double x, double y, double z)`
- `public void setSprinting(boolean sprinting)`
- `public void setXPStats(float currentXP, int maxXP, int level)`
- `public void addChatMessage( IChatComponent component)`
- `public boolean canCommandSenderUseCommand(int permLevel, java.lang.String commandName)`
- `public BlockPos getPosition()`
- `public void playSound(java.lang.String name, float volume, float pitch)`
- `public boolean isServerWorld()`
- `public boolean isRidingHorse()`
- `public float getHorseJumpPower()`
- `public void openEditSign( TileEntitySign signTile)`
- `public void openEditCommandBlock( CommandBlockLogic cmdBlockLogic)`
- `public void displayGUIBook( ItemStack bookStack)`
- `public void displayGUIChest( IInventory chestInventory)`
- `public void displayGUIHorse( EntityHorse horse, IInventory horseInventory)`
- `public void displayGui( IInteractionObject guiOwner)`
- `public void displayVillagerTradeGui( IMerchant villager)`
- `public void onCriticalHit( Entity entityHit)`
- `public void onEnchantmentCritical( Entity entityHit)`
- `public boolean isSneaking()`
- `public void updateEntityActionState()`
- `protected boolean isCurrentViewEntity()`
- `public void onLivingUpdate()`

## Description

The amount of time an entity has been in a Portal the previous tick