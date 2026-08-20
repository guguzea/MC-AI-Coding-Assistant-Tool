# Mob Effects

> 来源：https://raw.githubusercontent.com/FabricMC/fabric-docs/main/versions/1.20.4/develop/entities/effects.md
> 版本：1.20.4
> GitHub 路径：develop/entities/effects.md
> 抓取源：github_raw_versioned
> 抓取时间：2026-08-20T09:42:26.062Z
> SHA256：c9679ca92f806a58d6b9328239b14065e816a3eb0c78794893b31bb12a594dfa
> 分支：main

---
title: Mob Effects
description: Learn how to add custom mob effects.
authors:
  - dicedpixels
  - YanisBft
  - FireBlast
  - Friendly-Banana
  - SattesKrokodil
authors-nogithub:
  - siglong
  - tao0lu

search: false
---

Mob effects, also known as status effects or simply effects, are a condition that can affect an entity. They can be positive, negative or neutral in nature. The base game
applies these effects in various ways such as food, potions etc.

The `/effect` command can be used to apply effects on an entity.

## Custom Mob Effects {#custom-status-effects}

In this tutorial we'll add a new custom effect called _Tater_ which gives you one experience point every game tick.

### Extend `MobEffect` {#extend-statuseffect}

Let's create a custom effect class by extending `MobEffect`, which is the base class for all effects.

@[code lang=java transcludeWith=:::1](@/reference/1.20.4/src/main/java/com/example/docs/effect/TaterEffect.java)

### Registering Your Custom Effect {#registering-your-custom-effect}

Similar to block and item registration, we use `Registry.register` to register our custom effect into the
`MOB_EFFECT` registry. This can be done in our initializer.

@[code lang=java transcludeWith=:::1](@/reference/1.20.4/src/main/java/com/example/docs/effect/ExampleModEffects.java)

### Texture {#texture}

The status effect icon is a 18x18 PNG which will appear in the player's inventory screen. Place your custom icon in:

```:no-line-numbers
resources/assets/example-mod/textures/mob_effect/tater.png
```

<DownloadEntry type="Example Texture" visualURL="/assets/develop/tater-effect.png" downloadURL="/assets/develop/tater-effect-icon.png" />

### Translations {#translations}

Like any other translation, you can add an entry with ID format `"effect.example-mod.<effect-identifier>": "Value"` to the
language file.

```json
{
  "effect.example-mod.tater": "Tater"
}
```

### Testing {#testing}

Use the command `/effect give @p example-mod:tater` to give the player our Tater effect.
Use `/effect clear @p example-mod:tater` to remove the effect.

::: info
To create a potion that uses this effect, please see the [Potions](../items/potions) guide.
:::
