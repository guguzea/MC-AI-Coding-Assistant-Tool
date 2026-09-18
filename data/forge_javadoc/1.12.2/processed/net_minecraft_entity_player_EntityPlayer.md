# EntityPlayer

## Class signature

```java
public abstract class EntityPlayer extends EntityLivingBase
```

## Constructors

- `public EntityPlayer( World worldIn, GameProfile gameProfileIn)`

## Methods

- `protected CooldownTracker createCooldownTracker()`
- `protected void applyEntityAttributes()`
- `protected void entityInit()`
- `public void onUpdate()`
- `protected void updateSize()`
- `public int getMaxInPortalTime()`
- `protected SoundEvent getSwimSound()`
- `protected SoundEvent getSplashSound()`
- `public int getPortalCooldown()`
- `public void playSound( SoundEvent soundIn, float volume, float pitch)`
- `public SoundCategory getSoundCategory()`
- `protected int getFireImmuneTicks()`
- `public void handleStatusUpdate(byte id)`
- `protected boolean isMovementBlocked()`
- `public void closeScreen()`
- `public void updateRidden()`
- `public void preparePlayerToSpawn()`
- `protected void updateEntityActionState()`
- `public void onLivingUpdate()`
- `public int getScore()`
- `public void setScore(int scoreIn)`
- `public void addScore(int scoreIn)`
- `public void onDeath( DamageSource cause)`
- `protected void destroyVanishingCursedItems()`
- `protected SoundEvent getHurtSound( DamageSource damageSourceIn)`
- `protected SoundEvent getDeathSound()`
- `public EntityItem dropItem(boolean dropAll)`
- `public EntityItem dropItem( ItemStack itemStackIn, boolean unused)`
- `public EntityItem dropItem( ItemStack droppedItem, boolean dropAround, boolean traceItem)`
- `public ItemStack dropItemAndGetStack( EntityItem p_184816_1_)`
- `@Deprecated public float getDigSpeed( IBlockState state)`
- `public float getDigSpeed( IBlockState state, BlockPos pos)`
- `public boolean canHarvestBlock( IBlockState state)`
- `public static void registerFixesPlayer( DataFixer fixer)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `protected void blockUsingShield( EntityLivingBase p_190629_1_)`
- `public boolean canAttackPlayer( EntityPlayer other)`
- `protected void damageArmor(float damage)`
- `protected void damageShield(float damage)`
- `public float getArmorVisibility()`
- `protected void damageEntity( DamageSource damageSrc, float damageAmount)`
- `public void openEditSign( TileEntitySign signTile)`
- `public void displayGuiEditCommandCart( CommandBlockBaseLogic commandBlock)`
- `public void displayGuiCommandBlock( TileEntityCommandBlock commandBlock)`
- `public void openEditStructure( TileEntityStructure structure)`
- `public void displayVillagerTradeGui( IMerchant villager)`
- `public void displayGUIChest( IInventory chestInventory)`
- `public void openGuiHorseInventory( AbstractHorse horse, IInventory inventoryIn)`
- `public void displayGui( IInteractionObject guiOwner)`
- `public void openBook( ItemStack stack, EnumHand hand)`
- `public EnumActionResult interactOn( Entity p_190775_1_, EnumHand p_190775_2_)`
- `public double getYOffset()`
- `public void dismountRidingEntity()`
- `public void attackTargetEntityWithCurrentItem( Entity targetEntity)`
- `public void disableShield(boolean p_190777_1_)`
- `public void onCriticalHit( Entity entityHit)`
- `public void onEnchantmentCritical( Entity entityHit)`
- `public void spawnSweepParticles()`
- `public void respawnPlayer()`
- `public void setDead()`
- `public boolean isEntityInsideOpaqueBlock()`
- `public boolean isUser()`
- `public GameProfile getGameProfile()`
- `public EntityPlayer.SleepResult trySleep( BlockPos bedLocation)`
- `public void wakeUpPlayer(boolean immediately, boolean updateWorldFlag, boolean setSpawn)`
- `public static BlockPos getBedSpawnLocation( World worldIn, BlockPos bedLocation, boolean forceSpawn)`
- `public float getBedOrientationInDegrees()`
- `public boolean isPlayerSleeping()`
- `public boolean isPlayerFullyAsleep()`
- `public int getSleepTimer()`
- `public void sendStatusMessage( ITextComponent chatComponent, boolean actionBar)`
- `public BlockPos getBedLocation()`
- `@Deprecated public boolean isSpawnForced()`
- `public void setSpawnPoint( BlockPos pos, boolean forced)`
- `public void addStat( StatBase stat)`
- `public void addStat( StatBase stat, int amount)`
- `public void takeStat( StatBase stat)`
- `public void unlockRecipes(java.util.List< IRecipe > p_192021_1_)`
- `public void unlockRecipes( ResourceLocation [] p_193102_1_)`
- `public void resetRecipes(java.util.List< IRecipe > p_192022_1_)`
- `public void jump()`
- `public void travel(float strafe, float vertical, float forward)`
- `public float getAIMoveSpeed()`
- `public void addMovementStat(double p_71000_1_, double p_71000_3_, double p_71000_5_)`
- `public void fall(float distance, float damageMultiplier)`
- `protected void doWaterSplashEffect()`
- `protected SoundEvent getFallSound(int heightIn)`
- `public void onKillEntity( EntityLivingBase entityLivingIn)`
- `public void setInWeb()`
- `public void addExperience(int amount)`
- `public int getXPSeed()`
- `public void onEnchant( ItemStack enchantedItem, int cost)`
- `public void addExperienceLevel(int levels)`
- `public int xpBarCap()`
- `public void addExhaustion(float exhaustion)`
- `public FoodStats getFoodStats()`
- `public boolean canEat(boolean ignoreHunger)`
- `public boolean shouldHeal()`
- `public boolean isAllowEdit()`
- `public boolean canPlayerEdit( BlockPos pos, EnumFacing facing, ItemStack stack)`
- `protected int getExperiencePoints( EntityPlayer player)`
- `protected boolean isPlayer()`
- `public boolean getAlwaysRenderNameTagForRender()`
- `protected boolean canTriggerWalking()`
- `public void sendPlayerAbilities()`
- `public void setGameType( GameType gameType)`
- `public java.lang.String getName()`
- `public InventoryEnderChest getInventoryEnderChest()`
- `public ItemStack getItemStackFromSlot( EntityEquipmentSlot slotIn)`
- `public void setItemStackToSlot( EntityEquipmentSlot slotIn, ItemStack stack)`
- `public boolean addItemStackToInventory( ItemStack p_191521_1_)`
- `public java.lang.Iterable< ItemStack > getHeldEquipment()`
- `public java.lang.Iterable< ItemStack > getArmorInventoryList()`
- `public boolean addShoulderEntity( NBTTagCompound p_192027_1_)`
- `protected void spawnShoulderEntities()`
- `public boolean isInvisibleToPlayer( EntityPlayer player)`
- `public abstract boolean isSpectator()`
- `public abstract boolean isCreative()`

## Description

Add a prefix to the player's username in chat