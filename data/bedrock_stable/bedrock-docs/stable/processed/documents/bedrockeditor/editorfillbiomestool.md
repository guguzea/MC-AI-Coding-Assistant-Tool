> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/bedrockeditor/editorfillbiomestool?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:50:29.142Z
> 警告：此文档可能滞后于当前正式版

# Fill Biomes Tool

The Fill Biomes tool lets you reassign the biome of any region in your world without affecting blocks or terrain shape. Simply select an area, choose a target biome, and apply the change. You can also use mask filters to limit which existing biomes or biome tags are replaced.

## Using Fill Biomes

- Open Fill Biomes by selecting it from the tool rail or Action Bar.

- Use Selection to highlight the region where you want to change the biome. The selection you make defines the 3D volume that will be affected.

- Choose a Target Biome from the biome dropdown. This is the biome that will be applied to the selected region.

- (Optional) Configure mask settings to restrict the fill to only replace specific biomes within the selection.

- (Optional) Enable Mask by Biome Tag to filter by biome tags instead of individual biomes. Use the allow/exclude lists to control which biome tags are included or excluded from the fill operation.

- Click Fill to apply the biome change. A confirmation dialog appears before the operation is committed. Note The fill operation respects the full vertical extent of the selection. Larger selections take a bit longer to process.

Important

Biome changes do not take visible effect in the world until you leave and re-enter the game. Grass color, foliage, sky tint, and other biome-dependent visuals update only after reloading the world.

## Mask options

The Fill Biomes tool provides two masking modes that can be used independently or together:

- Mask by Biome : Filters specific biome types. Choose between an Allowed list (only replace these biomes) or an Excluded list (replace everything except these biomes).

- Mask by Biome Tag : Filter by biome tags rather than individual biomes. This is useful when you want to target broad categories such as all ocean biomes or all mountain biomes.

Tip

You can use the search feature within the mask configuration to quickly find biomes or tags to add to your allow/exclude lists.

## Region management

The Fill Biomes tool tracks reassigned regions so you can review which biomes have been changed within your project. Region assignments persist across sessions.

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
