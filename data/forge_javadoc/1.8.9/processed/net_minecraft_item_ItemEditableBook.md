# ItemEditableBook

**Inheritance:** java.lang.Object → net.minecraft.item.Item → net.minecraft.item.ItemEditableBook

## Class signature

```java
public class ItemEditableBook extends Item
```

## Methods

- `void addInformation(ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)` — allows items to add custom lines of information to the mouseover description
- `static int getGeneration(ItemStack book)` — Gets the generation of the book (how many times it has been cloned)
- `java.lang.String getItemStackDisplayName(ItemStack stack)`
- `boolean hasEffect(ItemStack stack)`
- `ItemStack onItemRightClick(ItemStack itemStackIn, World worldIn, EntityPlayer playerIn)` — Called whenever this item is equipped and the right mouse button is pressed.
- `static boolean validBookTagContents(NBTTagCompound nbt)`

## Fields

- `ItemEditableBook`