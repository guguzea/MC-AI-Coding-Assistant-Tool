---
title: "CreativeTabs"
description: "public abstract class CreativeTabs extends java.lang.Object"
package: "net/minecraft/creativetab"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/creativetab/CreativeTabs.html"
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

- `void addEnchantmentBooksToList(java.util.List<ItemStack> itemList, EnumEnchantmentType ... enchantmentType)` — Adds the enchantment books from the supplied EnumEnchantmentType to the given list.
- `void displayAllReleventItems(java.util.List<ItemStack> p_78018_1_)` — only shows items which have tabToDisplayOn == this
- `boolean drawInForegroundOfTab()`
- `java.lang.String getBackgroundImageName()`
- `int getIconItemDamage()`
- `ItemStack getIconItemStack()`
- `static int getNextID()`
- `EnumEnchantmentType [] getRelevantEnchantmentTypes()` — Returns the enchantment types relevant to this tab
- `int getSearchbarWidth()` — Gets the width of the search bar of the creative tab, use this if your creative tab name overflows together with a custom texture.
- `int getTabColumn()` — returns index % 6
- `abstract Item getTabIconItem()`
- `int getTabIndex()`
- `java.lang.String getTabLabel()`
- `int getTabPage()`
- `java.lang.String getTranslatedTabLabel()` — Gets the translated Label.
- `boolean hasRelevantEnchantmentType(EnumEnchantmentType enchantmentType)`
- `boolean hasSearchBar()` — Determines if the search bar should be shown for this tab.
- `boolean isTabInFirstRow()` — returns tabIndex < 6
- `CreativeTabs setBackgroundImageName(java.lang.String texture)`
- `CreativeTabs setNoScrollbar()`
- `CreativeTabs setNoTitle()`
- `CreativeTabs setRelevantEnchantmentTypes(EnumEnchantmentType ... types)` — Sets the enchantment types for populating this tab with enchanting books
- `boolean shouldHidePlayerInventory()`

## Fields

- `static CreativeTabs [] creativeTabArray`
- `static CreativeTabs tabAllSearch`
- `static CreativeTabs tabBlock`
- `static CreativeTabs tabBrewing`
- `static CreativeTabs tabCombat`
- `static CreativeTabs tabDecorations`
- `static CreativeTabs tabFood`
- `static CreativeTabs tabInventory`
- `static CreativeTabs tabMaterials`
- `static CreativeTabs tabMisc`
- `static CreativeTabs tabRedstone`
- `static CreativeTabs tabTools`
- `static CreativeTabs tabTransport`
