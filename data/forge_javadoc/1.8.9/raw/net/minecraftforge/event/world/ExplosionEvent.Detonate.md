---
title: "ExplosionEvent.Detonate"
description: "ExplosionEvent.Detonate is fired once the explosion has a list of affected blocks and entities. These lists can be modified to change the outcome. This event is not Cancelable . This event does not us"
package: "net/minecraftforge/event/world"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/event/world/ExplosionEvent.Detonate.html"
sourceType: javadoc
---

# ExplosionEvent.Detonate

## Constructors

- `public Detonate( World world, Explosion explosion, java.util.List< Entity > entityList)`

## Methods

- `public java.util.List< BlockPos > getAffectedBlocks()`
- `public java.util.List< Entity > getAffectedEntities()`

## Description

ExplosionEvent.Detonate is fired once the explosion has a list of affected blocks and entities. These lists can be modified to change the outcome. This event is not Cancelable . This event does not us
