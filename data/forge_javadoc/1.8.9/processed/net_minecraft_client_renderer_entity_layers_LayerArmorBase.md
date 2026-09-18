# LayerArmorBase

## Class signature

```java
public abstract class LayerArmorBase<T extends ModelBase > extends java.lang.Object implements LayerRenderer < EntityLivingBase >
```

## Constructors

- `public LayerArmorBase( RendererLivingEntity <?> rendererIn)`

## Methods

- `public void doRenderLayer( EntityLivingBase entitylivingbaseIn, float p_177141_2_, float p_177141_3_, float partialTicks, float p_177141_5_, float p_177141_6_, float p_177141_7_, float scale)`
- `public boolean shouldCombineTextures()`
- `public ItemStack getCurrentArmor( EntityLivingBase entitylivingbaseIn, int armorSlot)`
- `public T func_177175_a(int p_177175_1_)`
- `protected abstract void initArmor()`
- `protected abstract void func_177179_a( T p_177179_1_, int p_177179_2_)`
- `protected T getArmorModelHook( EntityLivingBase entity, ItemStack itemStack, int slot, T model)`
- `public ResourceLocation getArmorResource( Entity entity, ItemStack stack, int slot, java.lang.String type)`

## Description

Hook to allow item-sensitive armor model. for LayerBipedArmor.