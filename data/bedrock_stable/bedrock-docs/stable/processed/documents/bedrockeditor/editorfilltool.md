> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/bedrockeditor/editorfilltool?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:50:25.562Z
> 警告：此文档可能滞后于当前正式版

# Fill Tool

Smart Fill quickly replaces a connected region of blocks with the block type currently selected in the Block Picker. Click a block to “seed” the fill; all contiguous blocks of the same type near that seed are replaced within the size limit you set.

Tip

Selecting Air in the Block Picker lets you carve out regions by replacing matched blocks with air.

You can open the fill tool window by clicking the fill tool button on the left side of the Editor.

## Using the fill tool

- Select Fill from the tool rail on the left of the Editor.

- Choose the Area Limit in the fill tool window and decide whether or not to Restrict to Selection. Note Area Limit sets the maximum reach of Smart Fill in all directions around the clicked block. Range: 1–16. When Restrict to Selection is enabled, only blocks inside your current Selection are filled. Fills operate in 3D and dissimilar blocks or boundaries halt the spread.

- Use the Block Picker to choose the type of block you want to replace the terrain with.

- Click a block to replace the blocks around it with your selected block type. Note Only contiguous blocks of the same type will be replaced. For example, if you click a stone block to replace, all of the stone blocks within the area limit will be replaced with your selected block type. If there are any iron ore blocks within the area limit, they will not be replaced.

## Keyboard shortcuts

Some Action Bar items have default shortcuts. For the full list, see Editor Hotkeys .

 Command
 Shortcut

 Activate Smart Fill tool
 Ctrl+Shift+M

 Quick Fill selection (without opening the tool)
 Ctrl+F

 Ctrl+Shift+M opens the Smart Fill tool on the tool rail. Ctrl+F performs a quick fill of the current selection using the active block, without switching tools. The Ctrl+F shortcut is also used in other modes (for example, to fill a line in the Line tool).

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
