# ItemPotion

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Item> → net.minecraft.item.Item → net.minecraft.item.ItemPotion

## Class signature

```java
public class ItemPotion extends Item
```

## Methods

- `void addInformation(ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)`
- `java.lang.String getItemStackDisplayName(ItemStack stack)`
- `EnumAction getItemUseAction(ItemStack stack)`
- `int getMaxItemUseDuration(ItemStack stack)`
- `void getSubItems(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> subItems)`
- `boolean hasEffect(ItemStack stack)`
- `ActionResult<ItemStack> onItemRightClick(ItemStack itemStackIn, World worldIn, EntityPlayer playerIn, EnumHand hand)`
- `ItemStack onItemUseFinish(ItemStack stack, World worldIn, EntityLivingBase entityLiving)`

## Fields

- `ItemPotion`