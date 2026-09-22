---
title: "Item"
description: "public class Item extends IForgeRegistryEntry.Impl<Item>"
package: "net/minecraft/item"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/item/Item.html"
sourceType: javadoc
---

# Item

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Item> → net.minecraft.item.Item

## Class signature

```java
public class Item extends IForgeRegistryEntry.Impl<Item>
```

## Constructors

- `Item()`

## Methods

- `void addInformation(ItemStack stack, World worldIn, java.util.List<java.lang.String> tooltip, ITooltipFlag flagIn)`
- `void addPropertyOverride(ResourceLocation key, IItemPropertyGetter getter)`
- `boolean canApplyAtEnchantingTable(ItemStack stack, Enchantment enchantment)` — Checks whether an item can be enchanted with a certain enchantment.
- `boolean canContinueUsing(ItemStack oldStack, ItemStack newStack)` — Called while an item is in 'active' use to determine if usage should continue.
- `boolean canDestroyBlockInCreative(World world, BlockPos pos, ItemStack stack, EntityPlayer player)` — Checked from PlayerControllerMP.onPlayerDestroyBlock() when a creative player left-clicks a block with this item.
- `boolean canDisableShield(ItemStack stack, ItemStack shield, EntityLivingBase entity, EntityLivingBase attacker)` — Can this Item disable a shield
- `boolean canHarvestBlock(IBlockState blockIn)`
- `boolean canHarvestBlock(IBlockState state, ItemStack stack)` — ItemStack sensitive version of canHarvestBlock(IBlockState)
- `boolean canItemEditBlocks()`
- `Entity createEntity(World world, Entity location, ItemStack itemstack)` — This function should return a new entity to replace the dropped item.
- `boolean doesSneakBypassUse(ItemStack stack, IBlockAccess world, BlockPos pos, EntityPlayer player)` — Should this item, when held, allow sneak-clicks to pass through to the underlying block?
- `<any> getAnimationParameters(ItemStack stack, World world, EntityLivingBase entity)`
- `ModelBiped getArmorModel(EntityLivingBase entityLiving, ItemStack itemStack, EntityEquipmentSlot armorSlot, ModelBiped _default)` — Override this method to have an item handle its own armor rendering.
- `java.lang.String getArmorTexture(ItemStack stack, Entity entity, EntityEquipmentSlot slot, java.lang.String type)` — Called by RenderBiped and RenderPlayer to determine the armor texture that should be use for the currently equipped item.
- `<any> getAttributeModifiers(EntityEquipmentSlot slot, ItemStack stack)` — ItemStack sensitive version of getItemAttributeModifiers
- `static Item getByNameOrId(java.lang.String id)`
- `Item getContainerItem()`
- `ItemStack getContainerItem(ItemStack itemStack)` — ItemStack sensitive version of getContainerItem.
- `CreativeTabs getCreativeTab()`
- `CreativeTabs [] getCreativeTabs()` — Gets a list of tabs that items belonging to this class can display on, combined properly with getSubItems allows for a single item to span many sub-items across many tabs.
- `java.lang.String getCreatorModId(ItemStack itemStack)` — Called to get the Mod ID of the mod that *created* the ItemStack, instead of the real Mod ID that *registered* it.
- `int getDamage(ItemStack stack)` — Return the itemDamage represented by this ItemStack.
- `ItemStack getDefaultInstance()`
- `float getDestroySpeed(ItemStack stack, IBlockState state)`
- `double getDurabilityForDisplay(ItemStack stack)` — Queries the percentage of the 'Durability' bar that should be drawn.
- `int getEntityLifespan(ItemStack itemStack, World world)` — Retrieves the normal 'lifespan' of this item when it is dropped on the ground as a EntityItem.
- `EntityEquipmentSlot getEquipmentSlot(ItemStack stack)` — Override this to set a non-default armor slot for an ItemStack, but do not use this to get the armor slot of said stack; for that, use EntityLiving.getSlotForItemStack(ItemStack) .
- `FontRenderer getFontRenderer(ItemStack stack)` — Returns the font renderer used to render tooltips and overlays for this item.
- `IRarity getForgeRarity(ItemStack stack)`
- `int getHarvestLevel(ItemStack stack, java.lang.String toolClass, EntityPlayer player, IBlockState blockState)` — Queries the harvest level of this item stack for the specified tool class, Returns -1 if this tool is not of the specified type
- `boolean getHasSubtypes()`
- `java.lang.String getHighlightTip(ItemStack item, java.lang.String displayName)` — Allow the item one last chance to modify its name used for the tool highlight useful for adding something extra that can't be removed by a user in the displayed name, such as a mode of operation.
- `java.lang.String getHorseArmorTexture(EntityLiving wearer, ItemStack stack)`
- `HorseArmorType getHorseArmorType(ItemStack stack)` — Returns an enum constant of type HorseArmorType .
- `static int getIdFromItem(Item itemIn)`
- `boolean getIsRepairable(ItemStack toRepair, ItemStack repair)`
- `@Deprecated <any> getItemAttributeModifiers(EntityEquipmentSlot equipmentSlot)`
- `int getItemBurnTime(ItemStack itemStack)`
- `static Item getItemById(int id)`
- `int getItemEnchantability()`
- `int getItemEnchantability(ItemStack stack)` — ItemStack sensitive version of getItemEnchantability
- `static Item getItemFromBlock(Block blockIn)`
- `java.lang.String getItemStackDisplayName(ItemStack stack)`
- `@Deprecated int getItemStackLimit()`
- `int getItemStackLimit(ItemStack stack)` — Gets the maximum number of items that this stack should be able to hold.
- `EnumAction getItemUseAction(ItemStack stack)`
- `@Deprecated int getMaxDamage()`
- `int getMaxDamage(ItemStack stack)` — Return the maxDamage for this ItemStack.
- `int getMaxItemUseDuration(ItemStack stack)`
- `int getMetadata(int damage)`
- `int getMetadata(ItemStack stack)` — This used to be 'display damage' but its really just 'aux' data in the ItemStack, usually shares the same variable as damage.
- `NBTTagCompound getNBTShareTag(ItemStack stack)` — Override this method to change the NBT data being sent to the client.
- `IItemPropertyGetter getPropertyGetter(ResourceLocation key)`
- `@Deprecated EnumRarity getRarity(ItemStack stack)`
- `int getRGBDurabilityForDisplay(ItemStack stack)` — Returns the packed int RGB value used to render the durability bar in the GUI.
- `boolean getShareTag()`
- `float getSmeltingExperience(ItemStack item)` — Determines the base experience for a player when they remove this item from a furnace slot.
- `void getSubItems(CreativeTabs tab, NonNullList<ItemStack> items)`
- `TileEntityItemStackRenderer getTileEntityItemStackRenderer()`
- `java.util.Set<java.lang.String> getToolClasses(ItemStack stack)`
- `java.lang.String getUnlocalizedName()`
- `java.lang.String getUnlocalizedName(ItemStack stack)`
- `java.lang.String getUnlocalizedNameInefficiently(ItemStack stack)`
- `float getXpRepairRatio(ItemStack stack)` — Determines the amount of durability the mending enchantment will repair, on average, per point of experience.
- `@Deprecated boolean hasContainerItem()`
- `boolean hasContainerItem(ItemStack stack)` — ItemStack sensitive version of hasContainerItem
- `boolean hasCustomEntity(ItemStack stack)` — Determines if this Item has a special entity for when they are in the world.
- `boolean hasCustomProperties()`
- `boolean hasEffect(ItemStack stack)`
- `boolean hitEntity(ItemStack stack, EntityLivingBase target, EntityLivingBase attacker)`
- `ICapabilityProvider initCapabilities(ItemStack stack, NBTTagCompound nbt)` — Called from ItemStack.setItem, will hold extra data for the life of this ItemStack.
- `boolean isBeaconPayment(ItemStack stack)` — Whether this Item can be used as a payment to activate the vanilla beacon.
- `boolean isBookEnchantable(ItemStack stack, ItemStack book)` — Allow or forbid the specific book/item combination as an anvil enchant
- `boolean isDamageable()`
- `boolean isDamaged(ItemStack stack)` — Return if this itemstack is damaged.
- `boolean isEnchantable(ItemStack stack)`
- `boolean isFull3D()`
- `protected boolean isInCreativeTab(CreativeTabs targetTab)`
- `boolean isMap()`
- `boolean isRepairable()` — Called by CraftingManager to determine if an item is reparable.
- `boolean isShield(ItemStack stack, EntityLivingBase entity)` — Is this Item a shield
- `boolean isValidArmor(ItemStack stack, EntityEquipmentSlot armorType, Entity entity)` — Determines if the specific ItemStack can be placed in the specified armor slot, for the entity.
- `boolean itemInteractionForEntity(ItemStack stack, EntityPlayer playerIn, EntityLivingBase target, EnumHand hand)`
- `void onArmorTick(World world, EntityPlayer player, ItemStack itemStack)` — Called to tick armor in the armor slot.
- `boolean onBlockDestroyed(ItemStack stack, World worldIn, IBlockState state, BlockPos pos, EntityLivingBase entityLiving)`
- `boolean onBlockStartBreak(ItemStack itemstack, BlockPos pos, EntityPlayer player)` — Called before a block is broken.
- `void onCreated(ItemStack stack, World worldIn, EntityPlayer playerIn)`
- `boolean onDroppedByPlayer(ItemStack item, EntityPlayer player)` — Called when a player drops the item into the world, returning false from this will prevent the item from being removed from the players inventory and spawning in the world
- `boolean onEntityItemUpdate(EntityItem entityItem)` — Called by the default implemetation of EntityItem's onUpdate method, allowing for cleaner control over the update of the item without having to write a subclass.
- `boolean onEntitySwing(EntityLivingBase entityLiving, ItemStack stack)` — Called when a entity tries to play the 'swing' animation.
- `void onHorseArmorTick(World world, EntityLiving horse, ItemStack armor)` — Called every tick from EntityHorse#onUpdate() on the item in the armor slot.
- `ActionResult<ItemStack> onItemRightClick(World worldIn, EntityPlayer playerIn, EnumHand handIn)`
- `EnumActionResult onItemUse(EntityPlayer player, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `ItemStack onItemUseFinish(ItemStack stack, World worldIn, EntityLivingBase entityLiving)`
- `EnumActionResult onItemUseFirst(EntityPlayer player, World world, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ, EnumHand hand)` — This is called when the item is used, before the block is activated.
- `boolean onLeftClickEntity(ItemStack stack, EntityPlayer player, Entity entity)` — Called when the player Left Clicks (attacks) an entity.
- `void onPlayerStoppedUsing(ItemStack stack, World worldIn, EntityLivingBase entityLiving, int timeLeft)`
- `void onUpdate(ItemStack stack, World worldIn, Entity entityIn, int itemSlot, boolean isSelected)`
- `void onUsingTick(ItemStack stack, EntityLivingBase player, int count)` — Called each tick while using an item.
- `protected RayTraceResult rayTrace(World worldIn, EntityPlayer playerIn, boolean useLiquids)`
- `void readNBTShareTag(ItemStack stack, NBTTagCompound nbt)` — Override this method to decide what to do with the NBT data received from getNBTShareTag().
- `protected static void registerItemBlock(Block blockIn, Item itemIn)`
- `static void registerItems()`
- `void renderHelmetOverlay(ItemStack stack, EntityPlayer player, ScaledResolution resolution, float partialTicks)` — Called when the client starts rendering the HUD, for whatever item the player currently has as a helmet.
- `Item setContainerItem(Item containerItem)`
- `Item setCreativeTab(CreativeTabs tab)`
- `void setDamage(ItemStack stack, int damage)` — Set the damage for this itemstack.
- `Item setFull3D()`
- `void setHarvestLevel(java.lang.String toolClass, int level)` — Sets or removes the harvest level for the specified tool class.
- `Item setHasSubtypes(boolean hasSubtypes)`
- `Item setMaxDamage(int maxDamageIn)`
- `Item setMaxStackSize(int maxStackSize)`
- `Item setNoRepair()` — Call to disable repair recipes.
- `void setTileEntityItemStackRenderer(TileEntityItemStackRenderer teisr)`
- `Item setUnlocalizedName(java.lang.String unlocalizedName)`
- `boolean shouldCauseBlockBreakReset(ItemStack oldStack, ItemStack newStack)` — Called when the player is mining a block and the item in his hand changes.
- `boolean shouldCauseReequipAnimation(ItemStack oldStack, ItemStack newStack, boolean slotChanged)` — Determine if the player switching between these two item stacks
- `boolean shouldRotateAroundWhenRendering()`
- `boolean showDurabilityBar(ItemStack stack)` — Determines if the durability bar should be rendered for this item.
- `boolean updateItemStackNBT(NBTTagCompound nbt)`

## Fields

- `protected static java.util.UUID ATTACK_DAMAGE_MODIFIER`
- `protected static java.util.UUID ATTACK_SPEED_MODIFIER`
- `protected boolean bFull3D`
- `protected boolean canRepair`
- `protected boolean hasSubtypes`
- `protected static java.util.Random itemRand`
- `protected int maxStackSize`
- `static RegistryNamespaced<ResourceLocation, Item> REGISTRY`
