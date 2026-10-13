package com.mumfrey.webprefs.exceptions;

import com.mumfrey.webprefs.framework.RequestFailureReason;

public class InvalidResponseException extends RuntimeException
{
    private static final long serialVersionUID = 1L;

    private final RequestFailureReason response;
    
    public InvalidResponseException(RequestFailureReason response)
    {
        this.response = response;
    }

    public InvalidResponseException(RequestFailureReason response, String message)
    {
        super(message);
        this.response = response;
    }

    public InvalidResponseException(RequestFailureReason response, Throwable cause)
    {
        super(cause);
        this.response = response;
    }

    public InvalidResponseException(RequestFailureReason response, String message, Throwable cause)
    {
        super(message, cause);
        this.response = response;
    }

    public RequestFailureReason getReason()
    {
        return this.response;
    }
}
