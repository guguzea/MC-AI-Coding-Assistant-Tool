---
title: "EntityViewRenderEvent.CameraSetup"
description: "Event that allows mods to alter the angles of the player's camera. Mainly useful for applying roll."
package: "net/minecraftforge/client/event"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/event/EntityViewRenderEvent.CameraSetup.html"
sourceType: javadoc
---

# EntityViewRenderEvent.CameraSetup

## Constructors

- `public CameraSetup( EntityRenderer renderer, Entity entity, IBlockState state, double renderPartialTicks, float yaw, float pitch, float roll)`

## Methods

- `public float getYaw()`
- `public void setYaw(float yaw)`
- `public float getPitch()`
- `public void setPitch(float pitch)`
- `public float getRoll()`
- `public void setRoll(float roll)`

## Description

Event that allows mods to alter the angles of the player's camera. Mainly useful for applying roll.
