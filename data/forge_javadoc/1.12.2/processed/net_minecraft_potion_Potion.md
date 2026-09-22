# Potion

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Potion> → net.minecraft.potion.Potion

## Class signature

```java
public class Potion extends IForgeRegistryEntry.Impl<Potion>
```

## Constructors

- `Potion(boolean isBadEffectIn, int liquidColorIn)`

## Methods

- `void affectEntity(Entity source, Entity indirectSource, EntityLivingBase entityLivingBaseIn, int amplifier, double health)`
- `void applyAttributesModifiersToEntity(EntityLivingBase entityLivingBaseIn, AbstractAttributeMap attributeMapIn, int amplifier)`
- `double getAttributeModifierAmount(int amplifier, AttributeModifier modifier)`
- `java.util.Map<IAttribute, AttributeModifier> getAttributeModifierMap()`
- `java.util.List<ItemStack> getCurativeItems()` — Get a fresh list of items that can cure this Potion.
- `int getGuiSortColor(PotionEffect potionEffect)` — Used for determining PotionEffect sort order in GUIs.
- `static int getIdFromPotion(Potion potionIn)`
- `int getLiquidColor()`
- `java.lang.String getName()`
- `static Potion getPotionById(int potionID)`
- `static java.lang.String getPotionDurationString(PotionEffect effect, float durationFactor)`
- `static Potion getPotionFromResourceLocation(java.lang.String location)`
- `int getStatusIconIndex()`
- `boolean hasStatusIcon()`
- `boolean isBadEffect()`
- `boolean isBeneficial()`
- `boolean isInstant()`
- `boolean isReady(int duration, int amplifier)`
- `void performEffect(EntityLivingBase entityLivingBaseIn, int amplifier)`
- `Potion registerPotionAttributeModifier(IAttribute attribute, java.lang.String uniqueId, double ammount, int operation)`
- `static void registerPotions()`
- `void removeAttributesModifiersFromEntity(EntityLivingBase entityLivingBaseIn, AbstractAttributeMap attributeMapIn, int amplifier)`
- `@Deprecated void renderHUDEffect(int x, int y, PotionEffect effect, Minecraft mc, float alpha)` — Deprecated. use renderHUDEffect(PotionEffect, net.minecraft.client.gui.Gui, int, int, float, float)
- `void renderHUDEffect(PotionEffect effect, Gui gui, int x, int y, float z, float alpha)` — Called to draw the this Potion onto the player's ingame HUD when it's active.
- `@Deprecated void renderInventoryEffect(int x, int y, PotionEffect effect, Minecraft mc)` — Deprecated. use renderInventoryEffect(PotionEffect, net.minecraft.client.gui.Gui, int, int, float)
- `void renderInventoryEffect(PotionEffect effect, Gui gui, int x, int y, float z)` — Called to draw the this Potion onto the player's inventory when it's active.
- `Potion setBeneficial()`
- `protected Potion setEffectiveness(double effectivenessIn)`
- `protected Potion setIconIndex(int p_76399_1_, int p_76399_2_)`
- `Potion setPotionName(java.lang.String nameIn)`
- `boolean shouldRender(PotionEffect effect)` — If the Potion effect should be displayed in the players inventory
- `boolean shouldRenderHUD(PotionEffect effect)` — If the Potion effect should be displayed in the player's ingame HUD
- `boolean shouldRenderInvText(PotionEffect effect)` — If the standard PotionEffect text (name and duration) should be drawn when this potion is active.

## Fields

- `static RegistryNamespaced<ResourceLocation, Potion> REGISTRY`