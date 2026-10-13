/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.util;

import java.util.List;

import net.minecraft.util.text.ITextComponent;
import net.minecraft.util.text.Style;
import net.minecraft.util.text.TextComponentString;
import net.minecraft.util.text.TextFormatting;

/**
 * Utility functions for chat
 *
 * @author Adam Mummery-Smith
 */
public abstract class ChatUtilities
{
    private static String formattingCodeLookup;

    static
    {
        StringBuilder formattingCodes = new StringBuilder();

        for (TextFormatting chatFormat : TextFormatting.values())
        {
            formattingCodes.append(chatFormat.toString().charAt(1));
        }

        ChatUtilities.formattingCodeLookup = formattingCodes.toString();
    }

    private ChatUtilities() {}

    /**
     * Get a chat style from a legacy formatting code
     * 
     * @param code Code
     * @return chat style
     */
    public static Style getChatStyleFromCode(char code)
    {
        int pos = ChatUtilities.formattingCodeLookup.indexOf(code);
        if (pos < 0) return null;
        TextFormatting format = TextFormatting.values()[pos];

        Style style = new Style();
        if (format.func_96302_c())
        {
            style.func_150238_a(format);
        }
        else if (format.func_96301_b())
        {
            switch (format)
            {
                case BOLD: style.func_150227_a(true); break;
                case ITALIC: style.func_150217_b(true); break;
                case STRIKETHROUGH: style.func_150225_c(true); break;
                case UNDERLINE: style.func_150228_d(true); break;
                case OBFUSCATED: style.func_150237_e(true); break;
                default: return style;
            }
        }

        return style;
    }

    /**
     * Convert a component containing text formatted with legacy codes to a
     * native ChatComponent structure.
     */
    public static ITextComponent convertLegacyCodes(ITextComponent chat)
    {
        return ChatUtilities.covertCodesInPlace(chat);
    }

    private static List<ITextComponent> covertCodesInPlace(List<ITextComponent> siblings)
    {
        for (int index = 0; index < siblings.size(); index++)
        {
            siblings.set(index, ChatUtilities.covertCodesInPlace(siblings.get(index)));
        }

        return siblings;
    }

    private static ITextComponent covertCodesInPlace(ITextComponent component)
    {
        ITextComponent newComponent = null;
        if (component instanceof TextComponentString)
        {
            TextComponentString textComponent = (TextComponentString)component;
            Style style = textComponent.func_150256_b();
            String text = textComponent.func_150254_d();

            int pos = text.indexOf('\247');
            while (pos > -1 && text != null)
            {
                if (pos < text.length() - 1)
                {
                    ITextComponent head = new TextComponentString(pos > 0 ? text.substring(0, pos) : "").func_150255_a(style);
                    style = ChatUtilities.getChatStyleFromCode(text.charAt(pos + 1));
                    text = text.substring(pos + 2);
                    newComponent = (newComponent == null) ? head : newComponent.func_150257_a(head);
                    pos = text.indexOf('\247');
                }
                else
                {
                    text = null;
                }
            }

            if (text != null)
            {
                ITextComponent tail = new TextComponentString(text).func_150255_a(style);
                newComponent = (newComponent == null) ? tail : newComponent.func_150257_a(tail);
            }
        }

        if (newComponent == null)
        {
            ChatUtilities.covertCodesInPlace(component.func_150253_a());
            return component;
        }

        for (ITextComponent oldSibling : ChatUtilities.covertCodesInPlace(component.func_150253_a()))
        {
            newComponent.func_150257_a(oldSibling);
        }

        return newComponent;
    }
}
