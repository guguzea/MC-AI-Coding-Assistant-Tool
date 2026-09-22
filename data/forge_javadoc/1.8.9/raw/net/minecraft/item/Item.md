---
title: "Item"
description: "public class Item extends java.lang.Object"
package: "net/minecraft/item"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/Item.html"
sourceType: javadoc
---

# Item

**Inheritance:** java.lang.Object → net.minecraft.item.Item

## Class signature

```java
public class Item extends java.lang.Object
```

## Constructors

- `Item()`

## Methods

- `void addInformation(ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)` — allows items to add custom lines of information to the mouseover description
- `boolean canHarvestBlock(Block blockIn)` — Check whether this Item can harvest the given Block
- `boolean canHarvestBlock(Block par1Block, ItemStack itemStack)` — ItemStack sensitive version of canHarvestBlock(Block)
- `boolean canItemEditBlocks()` — Returns true if players can use this item to affect the world (e.g. placing blocks, placing ender eyes in portal) when not in creative
- `Entity createEntity(World world, Entity location, ItemStack itemstack)` — This function should return a new entity to replace the dropped item.
- `boolean doesSneakBypassUse(World world, BlockPos pos, EntityPlayer player)` — Should this item, when held, allow sneak-clicks to pass through to the underlying block?
- `@Deprecated ModelBiped getArmorModel(EntityLivingBase entityLiving, ItemStack itemStack, int armorSlot)` — Deprecated. Use 4-argument version.
- `ModelBiped getArmorModel(EntityLivingBase entityLiving, ItemStack itemStack, int armorSlot, ModelBiped _default)` — Override this method to have an item handle its own armor rendering.
- `java.lang.String getArmorTexture(ItemStack stack, Entity entity, int slot, java.lang.String type)` — Called by RenderBiped and RenderPlayer to determine the armor texture that should be use for the currently equipped item.
- `<any> getAttributeModifiers(ItemStack stack)` — ItemStack sensitive version of getItemAttributeModifiers
- `static Item getByNameOrId(java.lang.String id)` — Tries to get an Item by it's name (e.g. minecraft:apple) or a String representation of a numerical ID.
- `WeightedRandomChestContent getChestGenBase(ChestGenHooks chest, java.util.Random rnd, WeightedRandomChestContent original)` — Generates the base Random item for a specific instance of the chest gen, Enchanted books use this to pick a random enchantment.
- `int getColorFromItemStack(ItemStack stack, int renderPass)`
- `Item getContainerItem()`
- `ItemStack getContainerItem(ItemStack itemStack)` — ItemStack sensitive version of getContainerItem.
- `CreativeTabs getCreativeTab()` — gets the CreativeTab this item is displayed on
- `CreativeTabs [] getCreativeTabs()` — Gets a list of tabs that items belonging to this class can display on, combined properly with getSubItems allows for a single item to span many sub-items across many tabs.
- `int getDamage(ItemStack stack)` — Return the itemDamage represented by this ItemStack.
- `float getDigSpeed(ItemStack itemstack, IBlockState state)` — Metadata-sensitive version of getStrVsBlock
- `double getDurabilityForDisplay(ItemStack stack)` — Queries the percentage of the 'Durability' bar that should be drawn.
- `int getEntityLifespan(ItemStack itemStack, World world)` — Retrieves the normal 'lifespan' of this item when it is dropped on the ground as a EntityItem.
- `FontRenderer getFontRenderer(ItemStack stack)` — Returns the font renderer used to render tooltips and overlays for this item.
- `int getHarvestLevel(ItemStack stack, java.lang.String toolClass)` — Queries the harvest level of this item stack for the specifred tool class, Returns -1 if this tool is not of the specified type
- `boolean getHasSubtypes()`
- `java.lang.String getHighlightTip(ItemStack item, java.lang.String displayName)` — Allow the item one last chance to modify its name used for the tool highlight useful for adding something extra that can't be removed by a user in the displayed name, such as a mode of operation.
- `static int getIdFromItem(Item itemIn)`
- `boolean getIsRepairable(ItemStack toRepair, ItemStack repair)` — Return whether this item is repairable in an anvil.
- `@Deprecated <any> getItemAttributeModifiers()`
- `static Item getItemById(int id)`
- `int getItemEnchantability()` — Return the enchantability factor of the item, most of the time is based on material.
- `int getItemEnchantability(ItemStack stack)` — ItemStack sensitive version of getItemEnchantability
- `static Item getItemFromBlock(Block blockIn)`
- `java.lang.String getItemStackDisplayName(ItemStack stack)`
- `@Deprecated int getItemStackLimit()`
- `int getItemStackLimit(ItemStack stack)` — Gets the maximum number of items that this stack should be able to hold.
- `EnumAction getItemUseAction(ItemStack stack)` — returns the action that specifies what animation to play when the items is being used
- `int getMaxDamage()` — Returns the maximum damage an item can take.
- `int getMaxDamage(ItemStack stack)` — Return the maxDamage for this ItemStack.
- `int getMaxItemUseDuration(ItemStack stack)` — How long it takes to use or consume an item
- `int getMetadata(int damage)` — Converts the given ItemStack damage value into a metadata value to be placed in the world when this Item is placed as a Block (mostly used with ItemBlocks).
- `int getMetadata(ItemStack stack)` — This used to be 'display damage' but its really just 'aux' data in the ItemStack, usually shares the same variable as damage.
- `ModelResourceLocation getModel(ItemStack stack, EntityPlayer player, int useRemaining)` — Player, Render pass, and item usage sensitive version of getIconIndex.
- `protected MovingObjectPosition getMovingObjectPositionFromPlayer(World worldIn, EntityPlayer playerIn, boolean useLiquids)`
- `java.lang.String getPotionEffect(ItemStack stack)`
- `EnumRarity getRarity(ItemStack stack)` — Return an item rarity from EnumRarity
- `java.lang.String getRegistryName()` — A unique identifier for this block, if this block is registered in the game registry it will return that name.
- `boolean getShareTag()` — If this function returns true (or the item is damageable), the ItemStack's NBT tag will be sent to the client.
- `float getSmeltingExperience(ItemStack item)` — Determines the base experience for a player when they remove this item from a furnace slot.
- `float getStrVsBlock(ItemStack stack, Block block)`
- `void getSubItems(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> subItems)` — returns a list of items with the same ID, but different meta (eg: dye returns 16 items)
- `java.util.Set<java.lang.String> getToolClasses(ItemStack stack)`
- `java.lang.String getUnlocalizedName()` — Returns the unlocalized name of this item.
- `java.lang.String getUnlocalizedName(ItemStack stack)` — Returns the unlocalized name of this item.
- `java.lang.String getUnlocalizedNameInefficiently(ItemStack stack)` — Translates the unlocalized name of this item, but without the .name suffix, so the translation fails and the unlocalized name itself is returned.
- `@Deprecated boolean hasContainerItem()`
- `boolean hasContainerItem(ItemStack stack)` — ItemStack sensitive version of hasContainerItem
- `boolean hasCustomEntity(ItemStack stack)` — Determines if this Item has a special entity for when they are in the world.
- `boolean hasEffect(ItemStack stack)`
- `boolean hitEntity(ItemStack stack, EntityLivingBase target, EntityLivingBase attacker)` — Current implementations of this method in child classes do not use the entry argument beside ev.
- `ICapabilityProvider initCapabilities(ItemStack stack, NBTTagCompound nbt)` — Called from ItemStack.setItem, will hold extra data for the life of this ItemStack.
- `boolean isBeaconPayment(ItemStack stack)` — Whether this Item can be used as a payment to activate the vanilla beacon.
- `boolean isBookEnchantable(ItemStack stack, ItemStack book)` — Allow or forbid the specific book/item combination as an anvil enchant
- `boolean isDamageable()`
- `boolean isDamaged(ItemStack stack)` — Return if this itemstack is damaged.
- `boolean isFull3D()` — Returns True is the item is renderer in full 3D when hold.
- `boolean isItemTool(ItemStack stack)` — Checks isDamagable and if it cannot be stacked
- `boolean isMap()` — false for all Items except sub-classes of ItemMapBase
- `boolean isPotionIngredient(ItemStack stack)`
- `boolean isRepairable()` — Called by CraftingManager to determine if an item is reparable.
- `boolean isValidArmor(ItemStack stack, int armorType, Entity entity)` — Determines if the specific ItemStack can be placed in the specified armor slot.
- `boolean itemInteractionForEntity(ItemStack stack, EntityPlayer playerIn, EntityLivingBase target)` — Returns true if the item can be used on the given entity, e.g. shears on sheep.
- `void onArmorTick(World world, EntityPlayer player, ItemStack itemStack)` — Called to tick armor in the armor slot.
- `boolean onBlockDestroyed(ItemStack stack, World worldIn, Block blockIn, BlockPos pos, EntityLivingBase playerIn)` — Called when a Block is destroyed using this Item.
- `boolean onBlockStartBreak(ItemStack itemstack, BlockPos pos, EntityPlayer player)` — Called before a block is broken.
- `void onCreated(ItemStack stack, World worldIn, EntityPlayer playerIn)` — Called when item is crafted/smelted.
- `boolean onDroppedByPlayer(ItemStack item, EntityPlayer player)` — Called when a player drops the item into the world, returning false from this will prevent the item from being removed from the players inventory and spawning in the world
- `boolean onEntityItemUpdate(EntityItem entityItem)` — Called by the default implemetation of EntityItem's onUpdate method, allowing for cleaner control over the update of the item without having to write a subclass.
- `boolean onEntitySwing(EntityLivingBase entityLiving, ItemStack stack)` — Called when a entity tries to play the 'swing' animation.
- `ItemStack onItemRightClick(ItemStack itemStackIn, World worldIn, EntityPlayer playerIn)` — Called whenever this item is equipped and the right mouse button is pressed.
- `boolean onItemUse(ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ)` — Called when a Block is right-clicked with this Item
- `ItemStack onItemUseFinish(ItemStack stack, World worldIn, EntityPlayer playerIn)` — Called when the player finishes using this Item (E.g. finishes eating.).
- `boolean onItemUseFirst(ItemStack stack, EntityPlayer player, World world, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ)` — This is called when the item is used, before the block is activated.
- `boolean onLeftClickEntity(ItemStack stack, EntityPlayer player, Entity entity)` — Called when the player Left Clicks (attacks) an entity.
- `void onPlayerStoppedUsing(ItemStack stack, World worldIn, EntityPlayer playerIn, int timeLeft)` — Called when the player stops using an Item (stops holding the right mouse button).
- `void onUpdate(ItemStack stack, World worldIn, Entity entityIn, int itemSlot, boolean isSelected)` — Called each tick as long the item is on a player inventory.
- `void onUsingTick(ItemStack stack, EntityPlayer player, int count)` — Called each tick while using an item.
- `protected static void registerItemBlock(Block blockIn, Item itemIn)` — Register the given Item as the ItemBlock for the given Block.
- `static void registerItems()`
- `void renderHelmetOverlay(ItemStack stack, EntityPlayer player, ScaledResolution resolution, float partialTicks)` — Called when the client starts rendering the HUD, for whatever item the player currently has as a helmet.
- `Item setContainerItem(Item containerItem)`
- `Item setCreativeTab(CreativeTabs tab)` — returns this;
- `void setDamage(ItemStack stack, int damage)` — Set the damage for this itemstack.
- `Item setFull3D()` — Sets bFull3D to True and return the object.
- `void setHarvestLevel(java.lang.String toolClass, int level)` — Sets or removes the harvest level for the specified tool class.
- `Item setHasSubtypes(boolean hasSubtypes)`
- `Item setMaxDamage(int maxDamageIn)` — set max damage of an Item
- `Item setMaxStackSize(int maxStackSize)`
- `Item setNoRepair()` — Call to disable repair recipes.
- `Item setPotionEffect(java.lang.String potionEffect)` — Sets the string representing this item's effect on a potion when used as an ingredient.
- `Item setRegistryName(ResourceLocation name)`
- `Item setRegistryName(java.lang.String name)` — Sets a unique name for this Item.
- `Item setRegistryName(java.lang.String modID, java.lang.String name)`
- `Item setUnlocalizedName(java.lang.String unlocalizedName)` — Sets the unlocalized name of this item to the string passed as the parameter, prefixed by "item."
- `boolean shouldCauseReequipAnimation(ItemStack oldStack, ItemStack newStack, boolean slotChanged)` — Determine if the player switching between these two item stacks
- `boolean shouldRotateAroundWhenRendering()` — Returns true if this item should be rotated by 180 degrees around the Y axis when being held in an entities hands.
- `boolean showDurabilityBar(ItemStack stack)` — Determines if the durability bar should be rendered for this item.
- `boolean updateItemStackNBT(NBTTagCompound nbt)` — Called when an ItemStack with NBT data is read to potentially that ItemStack's NBT data

## Fields

- `protected boolean bFull3D` — If true, render the object in full 3D, like weapons and tools.
- `protected boolean canRepair`
- `RegistryDelegate<Item> delegate`
- `protected boolean hasSubtypes` — Some items (like dyes) have multiple subtypes on same item, this is field define this behavior
- `protected static java.util.UUID itemModifierUUID`
- `protected static java.util.Random itemRand` — The RNG used by the Item subclasses.
- `static RegistryNamespaced<ResourceLocation, Item> itemRegistry`
- `protected int maxStackSize` — Maximum size of the stack.
