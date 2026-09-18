---
title: "ItemPotion"
description: "public class ItemPotion extends Item"
package: "net/minecraft/item"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/item/ItemPotion.html"
sourceType: javadoc
---

# ItemPotion

## Class signature

```java
public class ItemPotion extends Item
```

## Constructors

- `public ItemPotion()`

## Methods

- `@Nullable public ItemStack onItemUseFinish( ItemStack stack, World worldIn, EntityLivingBase entityLiving)`
- `public int getMaxItemUseDuration( ItemStack stack)`
- `public EnumAction getItemUseAction( ItemStack stack)`
- `public ActionResult < ItemStack > onItemRightClick( ItemStack itemStackIn, World worldIn, EntityPlayer playerIn, EnumHand hand)`
- `public java.lang.String getItemStackDisplayName( ItemStack stack)`
- `public void addInformation( ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)`
- `public boolean hasEffect( ItemStack stack)`
- `public void getSubItems( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > subItems)`
