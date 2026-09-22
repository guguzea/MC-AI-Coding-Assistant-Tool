# ItemArmor

**Inheritance:** java.lang.Object → net.minecraft.item.Item → net.minecraft.item.ItemArmor

## Class signature

```java
public class ItemArmor extends Item
```

## Constructors

- `ItemArmor(ItemArmor.ArmorMaterial p_i45325_1_, int p_i45325_2_, int p_i45325_3_)`

## Methods

- `void func_82813_b(ItemStack p_82813_1_, int p_82813_2_)`
- `static IIcon func_94602_b(int p_94602_0_)`
- `ItemArmor.ArmorMaterial getArmorMaterial()`
- `int getColor(ItemStack p_82814_1_)`
- `int getColorFromItemStack(ItemStack p_82790_1_, int p_82790_2_)`
- `IIcon getIconFromDamageForRenderPass(int p_77618_1_, int p_77618_2_)`
- `boolean getIsRepairable(ItemStack p_82789_1_, ItemStack p_82789_2_)`
- `int getItemEnchantability()`
- `boolean hasColor(ItemStack p_82816_1_)`
- `ItemStack onItemRightClick(ItemStack p_77659_1_, World p_77659_2_, EntityPlayer p_77659_3_)`
- `void registerIcons(IIconRegister p_94581_1_)`
- `void removeColor(ItemStack p_82815_1_)`
- `boolean requiresMultipleRenderPasses()`

## Fields

- `int armorType`
- `int damageReduceAmount`
- `static java.lang.String[] EMPTY_SLOT_NAMES`
- `int renderIndex`