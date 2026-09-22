# ItemStack

**Inheritance:** java.lang.Object → net.minecraft.item.ItemStack

## Class signature

```java
public final class ItemStack extends java.lang.Object implements ICapabilitySerializable<NBTTagCompound>
```

## Constructors

- `ItemStack(Block blockIn)`
- `ItemStack(Block blockIn, int amount)`
- `ItemStack(Block blockIn, int amount, int meta)`
- `ItemStack(Item itemIn)`
- `ItemStack(Item itemIn, int amount)`
- `ItemStack(Item itemIn, int amount, int meta)`
- `ItemStack(Item itemIn, int amount, int meta, NBTTagCompound capNBT)`

## Methods

- `void addEnchantment(Enchantment ench, int level)` — Adds an enchantment with a desired level on the ItemStack.
- `static boolean areItemsEqual(ItemStack stackA, ItemStack stackB)` — Compares Item and damage value of the two stacks
- `static boolean areItemStacksEqual(ItemStack stackA, ItemStack stackB)` — compares ItemStack argument1 with ItemStack argument2; returns true if both ItemStacks are equal
- `static boolean areItemStackTagsEqual(ItemStack stackA, ItemStack stackB)`
- `boolean attemptDamageItem(int amount, java.util.Random rand)` — Attempts to damage the ItemStack with par1 amount of damage, If the ItemStack has the Unbreaking enchantment there is a chance for each point of damage to be negated.
- `boolean canDestroy(Block blockIn)`
- `boolean canEditBlocks()`
- `boolean canHarvestBlock(Block blockIn)` — Check whether the given Block can be harvested using this ItemStack.
- `boolean canPlaceOn(Block blockIn)`
- `void clearCustomName()` — Clear any custom name set for this ItemStack
- `ItemStack copy()` — Returns a new stack with the same properties.
- `static ItemStack copyItemStack(ItemStack stack)` — Creates a copy of a ItemStack, a null parameters will return a null.
- `void damageItem(int amount, EntityLivingBase entityIn)` — Damages the item in the ItemStack
- `void deserializeNBT(NBTTagCompound nbt)`
- `<any> getAttributeModifiers()`
- `<T> T getCapability(Capability<T> capability, EnumFacing facing)` — Retrieves the handler for the capability requested on the specific side.
- `IChatComponent getChatComponent()` — Get a ChatComponent for this Item's display name that shows this Item on hover
- `java.lang.String getDisplayName()` — returns the display name of the itemstack
- `NBTTagList getEnchantmentTagList()`
- `boolean getHasSubtypes()`
- `boolean getIsItemStackEqual(ItemStack p_179549_1_)`
- `Item getItem()` — Returns the object corresponding to the stack.
- `int getItemDamage()`
- `EntityItemFrame getItemFrame()` — Return the item frame this stack is on.
- `EnumAction getItemUseAction()`
- `int getMaxDamage()` — Returns the max damage an item in the stack can take.
- `int getMaxItemUseDuration()`
- `int getMaxStackSize()` — Returns maximum size of the stack.
- `int getMetadata()`
- `EnumRarity getRarity()`
- `int getRepairCost()` — Get this stack's repair cost, or 0 if no repair cost is defined.
- `float getStrVsBlock(Block blockIn)`
- `NBTTagCompound getSubCompound(java.lang.String key, boolean create)` — Get an NBTTagCompound from this stack's NBT data.
- `NBTTagCompound getTagCompound()` — Returns the NBTTagCompound of the ItemStack.
- `java.util.List<java.lang.String> getTooltip(EntityPlayer playerIn, boolean advanced)`
- `java.lang.String getUnlocalizedName()`
- `boolean hasCapability(Capability<?> capability, EnumFacing facing)` — Determines if this object has support for the capability in question on the specific side.
- `boolean hasDisplayName()` — Returns true if the itemstack has a display name
- `boolean hasEffect()`
- `boolean hasTagCompound()` — Returns true if the ItemStack has an NBTTagCompound.
- `void hitEntity(EntityLivingBase entityIn, EntityPlayer playerIn)` — Calls the corresponding fct in di
- `boolean interactWithEntity(EntityPlayer playerIn, EntityLivingBase entityIn)`
- `boolean isItemDamaged()` — returns true when a damageable item is damaged
- `boolean isItemEnchantable()` — True if it is a tool and has no enchantments to begin with
- `boolean isItemEnchanted()` — True if the item has enchantment data
- `boolean isItemEqual(ItemStack other)` — compares ItemStack argument to the instance ItemStack; returns true if the Items contained in both ItemStacks are equal
- `boolean isItemStackDamageable()` — true if this itemStack is damageable
- `boolean isOnItemFrame()` — Return whether this stack is on an item frame.
- `boolean isStackable()` — Returns true if the ItemStack can hold 2 or more units of the item.
- `static ItemStack loadItemStackFromNBT(NBTTagCompound nbt)`
- `void onBlockDestroyed(World worldIn, Block blockIn, BlockPos pos, EntityPlayer playerIn)` — Called when a Block is destroyed using this ItemStack
- `void onCrafting(World worldIn, EntityPlayer playerIn, int amount)`
- `boolean onItemUse(EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ)` — Called when the player uses this ItemStack on a Block (right-click).
- `ItemStack onItemUseFinish(World worldIn, EntityPlayer playerIn)` — Called when the item in use count reach 0, e.g. item food eaten.
- `void onPlayerStoppedUsing(World worldIn, EntityPlayer playerIn, int timeLeft)` — Called when the player releases the use item button.
- `void readFromNBT(NBTTagCompound nbt)` — Read the stack fields from a NBT object.
- `NBTTagCompound serializeNBT()`
- `void setItem(Item newItem)`
- `void setItemDamage(int meta)`
- `void setItemFrame(EntityItemFrame frame)` — Set the item frame this stack is on.
- `void setRepairCost(int cost)` — Set this stack's repair cost.
- `ItemStack setStackDisplayName(java.lang.String displayName)`
- `void setTagCompound(NBTTagCompound nbt)` — Assigns a NBTTagCompound to the ItemStack, minecraft validates that only non-stackable items can have it.
- `void setTagInfo(java.lang.String key, NBTBase value)`
- `ItemStack splitStack(int amount)` — Splits off a stack of the given amount of this stack and reduces this stack by the amount.
- `java.lang.String toString()`
- `void updateAnimation(World worldIn, Entity entityIn, int inventorySlot, boolean isCurrentItem)` — Called each tick as long the ItemStack in on player inventory.
- `ItemStack useItemRightClick(World worldIn, EntityPlayer playerIn)` — Called whenever this item stack is equipped and right clicked.
- `NBTTagCompound writeToNBT(NBTTagCompound nbt)` — Write the stack fields to a NBT object.

## Fields

- `int animationsToGo` — Number of animation frames to go when receiving an item (by walking into it, for example).
- `static java.text.DecimalFormat DECIMALFORMAT`
- `int stackSize` — Size of the stack.