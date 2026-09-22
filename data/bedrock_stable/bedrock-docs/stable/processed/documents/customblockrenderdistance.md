> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/customblockrenderdistance?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:50:17.821Z
> 警告：此文档可能滞后于当前正式版

# Custom Blocks: Render and Distance

When creating a custom block, you have a lot of things to consider about how it is displayed in the world. One of the important ones for making it feel like a seamless integration with existing blocks is understanding how its rendering method affects render distance.

Tip

For more about render distance, read the Simulation Distance, Render Distance, and Ticking Areas guide.

## Render method

For a full walkthrough of the functionality of the different render methods, see the Custom Block Render Lighting step.

There are 5 render methods to choose from for custom blocks:

- opaque

- double_sided

- blend

- alpha_test

- alpha_test_single_sided

These methods affect the block's transparency and translucency; depending on what effect your block needs, some methods will be more appropriate than others. The render method also determines the maximum render distance that your custom block will be displayed at:

- A block using the opaque method is considered a "far block"; it will be rendered all the way up to the maximum render distance in ideal conditions.

- A block using any other method is considered a "near" block; it will be rendered up to half the maximum render distance in ideal conditions.

By "ideal conditions," we mean not looking through an effect such as water or fog that reduces the render distance.

Water blocks are a special case: they use the `blend` rendering method, but are still considered a "far" block. This functionality currently can't be replicated by custom blocks.

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
