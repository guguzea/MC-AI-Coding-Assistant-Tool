> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/bedrockeditor/editorflood?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:50:27.455Z
> 警告：此文档可能滞后于当前正式版

# Flood Tool

The Flood Tool fills areas of your world with water or lava. Click a surface block to place a water level indicator, then raise or lower it to control the fluid height. The tool uses a breadth-first search to calculate which blocks the fluid will reach, respecting terrain boundaries and block-level waterlogging.

## Using Flood

- Select Flood by clicking the button in the tool rail on the left side of the Editor. Tip Pressing Ctrl+Shift+F also switches to the Flood Tool.

- Choose a Fluid Type (Water or Lava) in the tool settings pane.

- Click a surface block in the world. An air block above a solid block is required to place the water level indicator. A gizmo widget appears at the clicked location showing the current flood level.

- Use Page Up and Page Down to raise or lower the water level indicator. The tool recalculates the flood area each time you adjust the level. Note A bounding box visualization shows the calculated flood extent. If the boundary turns yellow, the 120,000-block limit has been reached and some area may be excluded. Enable Ignore Block Limit to override this restriction.

- Press Ctrl+F or click Apply Flood to commit the flood. The button tooltip displays the keyboard shortcut for quick reference. A progress dialog shows the operation status. Note The flood operation supports undo. If you need to revert, use the standard undo command ( Ctrl+Z ). Preview movement (raising/lowering the water level) also supports undo/redo.

## Limits

 Limit
 Value

 Maximum flood size
 120,000 blocks

 Flood region extent
 1,024 blocks in each direction from the origin

## Keyboard shortcuts

For the full list of Editor shortcuts, see Editor Hotkeys .

The following commands only work while the Flood Tool is active.

 Command
 Shortcut

 Activate Flood Tool
 Ctrl+Shift+F

 Raise water level
 Page Up

 Lower water level
 Page Down

 Delete water level indicator
 Ctrl+D

 Apply flood
 Ctrl+F

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
