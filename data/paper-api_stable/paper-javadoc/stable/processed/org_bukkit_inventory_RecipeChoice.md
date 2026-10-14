---
title: "org.bukkit.inventory.RecipeChoice"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/RecipeChoice.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface RecipeChoice**
`@NullMarked @NonExtendable public interface RecipeChoice extends Predicate<ItemStack>, Cloneable`
- `static RecipeChoice empty()`
- `@Contract(pure=true, value="_, _ -> new") static RecipeChoice.ItemTypeChoice itemType(ItemType itemType, ItemType... itemTypes)`
- `@Contract(pure=true, value="_ -> new") static RecipeChoice.ItemTypeChoice itemType(RegistryKeySet<ItemType> itemTypes)`
- `@Contract(value="_, _ -> new", pure=true) static RecipeChoice.ExactChoice exactChoice(ItemStack first, ItemStack... others)`
- `@Contract(value="_ -> new", pure=true) static RecipeChoice.ExactChoice exactChoice(List<ItemStack> stacks)`
- `@Contract(value="_, _ -> new", pure=true) static RecipeChoice.PredicateChoice predicateChoice(Predicate<? super ItemStack> stackPredicate, ItemStack exampleStack)`
- `@Deprecated(since="1.13.1") ItemStack getItemStack()`
- `RecipeChoice clone()`
- `boolean test(ItemStack itemStack)`
- `@Internal default RecipeChoice validate(boolean allowEmptyRecipes)`
