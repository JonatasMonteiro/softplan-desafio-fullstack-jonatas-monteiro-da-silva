package com.fullstackchallenge.backend.exception;

public class DuplicateUsernameException extends Exception {
    public DuplicateUsernameException(String errorMessage){
        super(errorMessage);
    }
}
