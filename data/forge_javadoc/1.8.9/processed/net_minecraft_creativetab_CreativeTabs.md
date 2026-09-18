# CreativeTabs

## Class signature

```java
public abstract class CreativeTabs extends java.lang.Object
```

## Constructors

- `public CreativeTabs(java.lang.String label)`
- `public CreativeTabs(int index, java.lang.String label)`

## Methods

- `public int getTabIndex()`
- `public CreativeTabs setBackgroundImageName(java.lang.String texture)`
- `public java.lang.String getTabLabel()`
- `public java.lang.String getTranslatedTabLabel()`
- `public ItemStack getIconItemStack()`
- `public abstract Item getTabIconItem()`
- `public int getIconItemDamage()`
- `public java.lang.String getBackgroundImageName()`
- `public boolean drawInForegroundOfTab()`
- `public CreativeTabs setNoTitle()`
- `public boolean shouldHidePlayerInventory()`
- `public CreativeTabs setNoScrollbar()`
- `public int getTabColumn()`
- `public boolean isTabInFirstRow()`
- `public EnumEnchantmentType [] getRelevantEnchantmentTypes()`
- `public CreativeTabs setRelevantEnchantmentTypes( EnumEnchantmentType ... types)`
- `public boolean hasRelevantEnchantmentType( EnumEnchantmentType enchantmentType)`
- `public void displayAllReleventItems(java.util.List< ItemStack > p_78018_1_)`
- `public void addEnchantmentBooksToList(java.util.List< ItemStack > itemList, EnumEnchantmentType ... enchantmentType)`
- `public int getTabPage()`
- `public static int getNextID()`
- `public boolean hasSearchBar()`
- `public int getSearchbarWidth()`

## Description

Adds the enchantment books from the supplied EnumEnchantmentType to the given list.