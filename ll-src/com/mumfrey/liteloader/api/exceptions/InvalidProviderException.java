/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.api.exceptions;

public class InvalidProviderException extends APIException
{
    private static final long serialVersionUID = 1L;

    public InvalidProviderException(String message, Throwable cause)
    {
        super(message, cause);
    }

    public InvalidProviderException(String message)
    {
        super(message);
    }
}
