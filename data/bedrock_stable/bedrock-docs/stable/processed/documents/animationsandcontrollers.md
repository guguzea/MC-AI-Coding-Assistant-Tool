> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/animationsandcontrollers?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:50:00.249Z
> 警告：此文档可能滞后于当前正式版

# Custom Animations and Animation Controllers

This tutorial is a continuation of Custom Behaviors and Render Controllers . We're going to add a custom sound and explore how to customize animations, leveraging the behavior and resource packs we set up in the previous guide to introduce you to animation controllers in a familiar way.

Feel free to customize the shapeshifter entity in any way you want – these steps are intended to be a framework for your own designs. Just keep in mind that any changes you make will cause deviations from our sample and you may have to debug some things until you get your adjustments working correctly. Just keep at it! Once you have a strong grasp on pack management, the sky truly is the limit for what you can do with your worlds.

## Prerequisites

We strongly recommend that you read through these guides and can confidently complete the previous tutorial before you begin this advanced tutorial.

- Custom Behaviors and Render Controllers

- Animation Documentation

- Animations vs. Animation Controllers

- Particle Effects

## Customizing mob sounds

First, we're going to create and add a custom sound for when the Shapeshifter changes forms.

- Create a sound pack folder in the shapeshifter Resource Pack we created in the previous tutorial to house the shapeshifter’s custom sounds.

- Record your custom sound and save it to the new sounds folder as an .ogg file. For this tutorial, our sample will leverage a custom sound we called phase_change.ogg. Tip Check out our article on adding new sounds for a refresher on how to structure your sound pack to customize sounds in Minecraft: Bedrock Edition.

- Tether the new sound to the shapeshifter mob by adding a sound_effects object to the client entity file (i.e. shapeshifter.entity.json) description. This maps the short name used in the animation controller to the full sound identifier. ```json "sound_effects": { "phase_change": "shapeshifter.phase_change" } ```

- Add the following in a sound_definitions.json file in the sounds folder: ```json "format_version" : "1.20.20", "sound_definitions" : { "shapeshifter.phase_change" : { "__use_legacy_max_distance" : "true", "category" : "block", "max_distance" : null, "min_distance" : null, "sounds" : [ "sounds/shapeshifter/phase_change" ] } } ```

- Finally, add a play_sound object to the minecraft:become_angry event on the server-side behavior file (i.e. shapeshifter.behavior.json), before the randomize component we created in the first tutorial: ```json { "play_sound": { "sound": "shapeshifter.phase_change" } } ```

## Customizing particle and emissive properties

Next, we're going to leverage the witchspell particle and its emissive properties for when our shapeshifter transforms.

- Create a particle folder in the shapeshifter resource pack and paste the witchspell.json file into it.

- Add a particle_effects object to the client entity file (i.e. shapeshifter.entity.json) description, before animations : ```json "particle_effects": { "shapeshift": "sample:witchspell_emitter" }, ```

- Add the emit_particle object to the server-side behavior file (i.e. shapeshifter.behavior.json) description, before the play_sound component we created in the previous section: ```json { "emit_particle": { "particle": "witchspell_emitter" } }, ```

## Customizing bone animations

Now it's time to add a custom animation to the Shapeshifter to signal when it's changing forms.

- Open shapeshifter.geo in Blockbench to edit the shapeshifter.

- Click Animate in the top right corner of the canvas, then create a new animation and select shapeshifter.geo as the file to save to.

- Use Blockbench to create a custom animation for the shapeshifter, then save your animation to update the shapeshifter’s file. Tip To save your animation, go to the Blockbench file menu bar, select Animation , then click Save All Animations . We made our shapeshifter wave its arms as it begins to change phases for our sample, but feel free to let your creativity guide you!

- Finally, add an animation_controller file to the animation_controllers folder in your shapeshifter’s resource pack. ```json "format_version": "1.10.0", "animation_controllers": { "controller.animation.shapeshifter.phase_change": { "initial_state": "default", "states": { "default": { "animations": ["phase_change"], "transitions": [ { "phase_changing": "q.property('minecraft:shape') != 'shapeshifter'" } ] }, "phase_changing": { "animations": ["phase_change"], "sound_effects": [ { "effect": "phase_change" } ], "transitions": [ { "default": "q.property('minecraft:shape') == 'shapeshifter'" } ], "blend_transition": 0.2 } } } } ``` We associated our animation with the component that controls the shapeshifter's geometry, but feel free to get creative to give your shapeshifter even more unique parameters!

### See Also

- Snowstorm Documentation

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
