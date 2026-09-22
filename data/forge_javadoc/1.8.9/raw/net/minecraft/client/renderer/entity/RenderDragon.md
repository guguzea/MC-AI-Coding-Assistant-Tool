---
title: "RenderDragon"
description: "public class RenderDragon extends RenderLiving<EntityDragon>"
package: "net/minecraft/client/renderer/entity"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/entity/RenderDragon.html"
sourceType: javadoc
---

# RenderDragon

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.entity.Render<T> → net.minecraft.client.renderer.entity.RendererLivingEntity<T> → net.minecraft.client.renderer.entity.RenderLiving<EntityDragon> → net.minecraft.client.renderer.entity.RenderDragon

## Class signature

```java
public class RenderDragon extends RenderLiving<EntityDragon>
```

## Constructors

- `RenderDragon(RenderManager renderManagerIn)`

## Methods

- `void doRender(EntityDragon entity, double x, double y, double z, float entityYaw, float partialTicks)` — Actually renders the given argument.
- `protected void drawRechargeRay(EntityDragon dragon, double p_180574_2_, double p_180574_4_, double p_180574_6_, float p_180574_8_)` — Draws the ray from the dragon to it's crystal
- `protected ResourceLocation getEntityTexture(EntityDragon entity)` — Returns the location of an entity's texture.
- `protected void renderModel(EntityDragon entitylivingbaseIn, float p_77036_2_, float p_77036_3_, float p_77036_4_, float p_77036_5_, float p_77036_6_, float p_77036_7_)` — Renders the model in RenderLiving
- `protected void rotateCorpse(EntityDragon bat, float p_77043_2_, float p_77043_3_, float partialTicks)`

## Fields

- `protected ModelDragon modelDragon` — An instance of the dragon model in RenderDragon
