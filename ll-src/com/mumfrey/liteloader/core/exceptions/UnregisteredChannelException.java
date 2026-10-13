/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.core.exceptions;

public class UnregisteredChannelException extends RuntimeException
{
    private static final long serialVersionUID = 1L;

    public UnregisteredChannelException(String message)
    {
        super(message);
    }
}
