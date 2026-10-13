/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client.gui;

import static com.mumfrey.liteloader.gl.GL.*;

import com.mumfrey.liteloader.client.api.LiteLoaderBrandingProvider;

import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.GuiButton;

/**
 * Super-simple implementation of a checkbox control
 * 
 * @author Adam Mummery-Smith
 */
public class GuiCheckbox extends GuiButton
{
    public boolean checked;

    public GuiCheckbox(int controlId, int xPosition, int yPosition, String displayString)
    {
        super(controlId, xPosition, yPosition, Minecraft.func_71410_x().field_71466_p.func_78256_a(displayString) + 16, 12, displayString);
    }

    @Override
    public void func_191745_a(Minecraft minecraft, int mouseX, int mouseY, float partialTicks)
    {
        if (this.field_146125_m)
        {
            minecraft.func_110434_K().func_110577_a(LiteLoaderBrandingProvider.ABOUT_TEXTURE);
            glColor4f(1.0F, 1.0F, 1.0F, 1.0F);
            this.field_146123_n = mouseX >= this.field_146128_h
                    && mouseY >= this.field_146129_i
                    && mouseX < this.field_146128_h + this.field_146120_f
                    && mouseY < this.field_146129_i + this.field_146121_g;

            this.func_73729_b(this.field_146128_h, this.field_146129_i, this.checked ? 134 : 122, 80, 12, 12);
            this.func_146119_b(minecraft, mouseX, mouseY);

            int colour = 0xE0E0E0;
            if (!this.field_146124_l)
            {
                colour = 0xA0A0A0;
            }
            else if (this.field_146123_n)
            {
                colour = 0xFFFFA0;
            }

            this.func_73731_b(minecraft.field_71466_p, this.field_146126_j, this.field_146128_h + 16, this.field_146129_i + 2, colour);
        }
    }
}
