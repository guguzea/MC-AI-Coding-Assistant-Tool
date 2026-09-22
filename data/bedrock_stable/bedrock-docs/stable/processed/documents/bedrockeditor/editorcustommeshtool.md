> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/bedrockeditor/editorcustommeshtool?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:50:29.103Z
> 警告：此文档可能滞后于当前正式版

# Custom Mesh Tool

The Custom Mesh tool lets you import 3D mesh files and voxelize them into Minecraft blocks. Use the Custom Mesh to import an STL file, preview the wireframe in your world, adjust the size and rotation, and place it as a block structure.

## Using the Custom Mesh tool

- Select Custom Mesh from the tool rail on the left side of the Editor.

- Click Import to open the file picker, then select the STL file you want to convert into a structure. Note Only .stl files are supported. Files exceeding 50 MB or 200,000 triangles will be rejected.

- A gold wireframe preview of the mesh appears in the world after the file finishes importing. You can view the mesh name, triangle count, and file size from the tool pane.

- Adjust the placement settings to suit your situation: Position : Use the move gizmo in the viewport or enter coordinates directly to reposition the mesh.

- Size (in blocks): Controls the number of blocks along the mesh's longest axis. The default is 20 blocks and the upper limit is 256 blocks.

- Roll X / Yaw Y / Pitch Z : Rotate the mesh along each axis (±360°).

- Select a block type from the Block Picker to fill the voxelized shape with.

- Click Place Blocks to voxelize the mesh and place it in the world. Tip The placement operation is undoable. Use Ctrl+Z to revert if the result isn't what you expected.

- Click Cancel at any time to discard the current import and start over. Note A progress dialog appears during placement. You can cancel the operation while it's in progress.

## Limits

 Limit
 Value

 Maximum file size
 50 MB

 Maximum preview triangles
 200,000

 Maximum blocks per axis
 256

 Maximum total block volume
 4,000,000 blocks

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
