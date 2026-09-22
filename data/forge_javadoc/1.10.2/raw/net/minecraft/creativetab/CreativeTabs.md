---
title: "CreativeTabs"
description: "public abstract class CreativeTabs extends java.lang.Object"
package: "net/minecraft/creativetab"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/creativetab/CreativeTabs.html"
sourceType: javadoc
---

# CreativeTabs

**Inheritance:** java.lang.Object → net.minecraft.creativetab.CreativeTabs

## Class signature

```java
public abstract class CreativeTabs extends java.lang.Object
```

## Constructors

- `CreativeTabs(int index, java.lang.String label)`
- `CreativeTabs(java.lang.String label)`

## Methods

- `void addEnchantmentBooksToList(java.util.List<ItemStack> itemList, EnumEnchantmentType ... enchantmentType)`
- `void displayAllRelevantItems(java.util.List<ItemStack> p_78018_1_)`
- `boolean drawInForegroundOfTab()`
- `java.lang.String getBackgroundImageName()`
- `int getIconItemDamage()`
- `ItemStack getIconItemStack()`
- `static int getNextID()`
- `EnumEnchantmentType [] getRelevantEnchantmentTypes()`
- `int getSearchbarWidth()` — Gets the width of the search bar of the creative tab, use this if your creative tab name overflows together with a custom texture.
- `int getTabColumn()`
- `abstract Item getTabIconItem()`
- `int getTabIndex()`
- `java.lang.String getTabLabel()`
- `int getTabPage()`
- `java.lang.String getTranslatedTabLabel()`
- `boolean hasRelevantEnchantmentType(EnumEnchantmentType enchantmentType)`
- `boolean hasSearchBar()` — Determines if the search bar should be shown for this tab.
- `boolean isTabInFirstRow()`
- `CreativeTabs setBackgroundImageName(java.lang.String texture)`
- `CreativeTabs setNoScrollbar()`
- `CreativeTabs setNoTitle()`
- `CreativeTabs setRelevantEnchantmentTypes(EnumEnchantmentType ... types)`
- `boolean shouldHidePlayerInventory()`

## Fields

- `static CreativeTabs BREWING`
- `static CreativeTabs BUILDING_BLOCKS`
- `static CreativeTabs COMBAT`
- `static CreativeTabs [] CREATIVE_TAB_ARRAY`
- `static CreativeTabs DECORATIONS`
- `static CreativeTabs FOOD`
- `static CreativeTabs INVENTORY`
- `static CreativeTabs MATERIALS`
- `static CreativeTabs MISC`
- `static CreativeTabs REDSTONE`
- `static CreativeTabs SEARCH`
- `static CreativeTabs TOOLS`
- `static CreativeTabs TRANSPORTATION`
