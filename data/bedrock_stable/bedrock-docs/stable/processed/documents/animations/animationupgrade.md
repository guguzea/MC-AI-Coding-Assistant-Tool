> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/animations/animationupgrade?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:50:03.904Z
> 警告：此文档可能滞后于当前正式版

# Animation Documentation - Upgrading Animation Scripts

If you are updating your Animation scripts to the latest version of Minecraft: Bedrock Edition, there are a few steps needed depending on what version of Minecraft they were written in.

## Upgrade from v1.17.30 to v1.18.10

The major change with 1.18.10 is:

- Fixed an issue where animation controller events defined in the default state would get skipped if the controller immediately transitioned to another state.

## Upgrade from v1.10 to v1.17.30

- Molang expressions inside transitions that contain capital letters are properly evaluated now. Strings inside such expressions are not forced to lowercase anymore and work as expected.

## Upgrade from v1.8 Beta to v1.10

Some things to keep in mind when upgrading from 1.8 to 1.10 onward:

- The ability to have animations reference other animations in an arbitrarily deep hierarchy.

- The parameters section of animation controllers has been replaced with the variables section.

- In the entity definition file, animation controllers are now listed in the animations section, and a scriptAnimate section has been added to define which root animations to play. The v1.8 file format is backwards-compatible with v1.10 so you don't need to change anything (although we recommend refactoring your files in the spirit of v1.10 as there is a slight performance win with the new format, as well as it being simpler to understand.)

## Upgrade from v1.18.10 to v1.18.20

The major change with 1.18.20 is:

- Molang expressions inside animation scripts for actor resource definition (pre_animation and initialize) that contain capital letters are properly evaluated now. Strings inside such expressions are not forced to lowercase anymore and work as expected.

## Upgrade from v1.7 Beta to v1.8

To upgrade previous scripts, you'll want to do the following steps to all of your Molang scripts in the order listed:

- entity.flags.foo --> query.foo

- entity.member.foo --> query.foo

- entity.foo --> variable.foo

- params.foo --> global.foo

- The general rule is that 'query' represents read-only values from the entity the script is running on, and 'variable' represents read-write data created by the user.

- We've adopted snake_case for all names of things. You are welcome to use upper-case letters if you wish as we are case-insensitive, however we recommend snake_case in general.

- Several variables previously set on mobs have been changed to use the query.foo format. Look through the updated list below to see what has been added and changed.

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
