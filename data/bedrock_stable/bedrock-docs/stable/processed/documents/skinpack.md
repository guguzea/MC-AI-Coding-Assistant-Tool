> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/skinpack?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:49:31.265Z
> 警告：此文档可能滞后于当前正式版

# Introduction to Skin Packs

It takes only a few files to create a custom player skin in Minecraft. These are the usual ones found in most add-on packs:

- en_US.lang - This file lives in the texts folder and the name might be different, depending on your language preferences

- manifest.json

And these are the files specific to a skin pack:

- .png - The image that will be mapped into the player. There are some of tools out there to help with this, but for now, we are just going to use a basic graphic-editing program like Paint.net.

- skins.json - JSON file containing the metadata about the skins in your skin pack

If you put all these files together and make sure everything is complete and correct, then you will have created your own custom skin.

As always, there are lots and lots (and lots) of tools and resources out in the world about skin packs made by creators like you. This guide is intended to give you an overview of the basics so that you will have a point of reference to learn more.

## Sample skin pack

There is a sample skin pack available at the Microsoft samples GitHub. It may be used to understand the structure of skin packs and to check your work after the tutorial.

Before beginning this tutorial, you should be familiar with the basics of add-on development .

## Building the skin pack

For Minecraft to find and use your skin pack files, you have to set up the folders and files in a particular structure. This tutorial will guide you through creating the most basic folder and file structure of a pack that can be imported and used in Minecraft.

Start by creating a folder and naming it something like My_Skin_Pack . Then, add the following files:

### manifest.json

- Create a text file and name it manifest.json .

- Paste this content in there and put in the UUIDs. ```json { "format_version": 2, "header": { "name": "Tutorial Skin Pack", "uuid": " ", "version": [1, 0, 0] }, "modules": [ { "type": "skin_pack", "uuid": " ", "version": [1, 0, 0] } ] } ```

- Save and close the file.

### texts/en_US.lang

- Create a folder and name it texts .

- Create a text file in there and name it for your preferred language, such as en_US.lang .

- Paste in this text: ```text skin.sample.skin_example=Sample Skin skinpack.sample=Tutorial Skin Pack skinpack.sample.by=YourNameHere ```

- Save the file.

### .png

Download this file to use as an example.

### skins.json

Create a text file named skins.json and paste this text in there:

```json
{
 "skins": [
 {
 "localization_name": "Sample Skin",
 "geometry": "geometry.humanoid.custom",
 "texture": "skin_example.png",
 "type": "free"
 }
 ],
 "serialize_name": "sample",
 "localization_name": "sample"
}
```

The `serialize_name` and `localization_name` values are used in the .lang file in the paths starting with `skin.` or `skinpack.`

## Deploying the skin pack

- To use your new skin pack, create a .zip file of the contents and save it with the .mcpack extension.

- Double-click the .mcpack to open it. Minecraft will launch and import the files automatically into the skin_packs folder inside your com.mojang directory. You should see messages stating that the import has started and that the skin pack was imported successfully.

- After Minecraft loads, click the Dressing Room button.

- If you get messages asking you to make a choice between Character Creator or Classic Skin, choose Classic Skin .

- Choose the little, green Featured Skins button with the clothes hanger on it, select your skin, then click Equip .

You have a new look!

## Troubleshooting

You can always download the sample skinpack and compare the contents with your files.

If Minecraft doesn't recognize your skin, then go to the main Minecraft Settings page, find the General tab, and make sure "Only Allow Trusted Skins" is toggled off.

## What's next?

Now that you know more about how skin packs work, learn more about how other add-on packs work if you haven't yet!

- An Introduction to Behavior Packs

- An Introduction to Resource Packs

- Comprehensive Add-On Pack Contents

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
