# RenderPlayer

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.entity.Render<T> → net.minecraft.client.renderer.entity.RendererLivingEntity<AbstractClientPlayer> → net.minecraft.client.renderer.entity.RenderPlayer

## Class signature

```java
public class RenderPlayer extends RendererLivingEntity<AbstractClientPlayer>
```

## Methods

- `void doRender(AbstractClientPlayer entity, double x, double y, double z, float entityYaw, float partialTicks)` — Actually renders the given argument.
- `protected ResourceLocation getEntityTexture(AbstractClientPlayer entity)` — Returns the location of an entity's texture.
- `ModelPlayer getMainModel()`
- `protected void preRenderCallback(AbstractClientPlayer entitylivingbaseIn, float partialTickTime)` — Allows the render to do any OpenGL state modifications necessary before the model is rendered.
- `void renderLeftArm(AbstractClientPlayer clientPlayer)`
- `protected void renderLivingAt(AbstractClientPlayer entityLivingBaseIn, double x, double y, double z)` — Sets a simple glTranslate on a LivingEntity.
- `protected void renderOffsetLivingLabel(AbstractClientPlayer entityIn, double x, double y, double z, java.lang.String str, float p_177069_9_, double p_177069_10_)`
- `void renderRightArm(AbstractClientPlayer clientPlayer)`
- `protected void rotateCorpse(AbstractClientPlayer bat, float p_77043_2_, float p_77043_3_, float partialTicks)`
- `void transformHeldFull3DItemLayer()`

## Fields

- `RenderPlayer`
- `RenderPlayer`