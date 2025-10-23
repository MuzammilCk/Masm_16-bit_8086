; Simple Addition Program
; This program adds two 8-bit numbers and stores the result
; Author: MASM Studio
; Date: 2025-10-16

ASSUME CS:CODE, DS:DATA

DATA SEGMENT
    OPR1 DB 20H        ; First operand (32 decimal)
    OPR2 DB 30H        ; Second operand (48 decimal)
    RES DW ?           ; Result (16-bit to handle overflow)
DATA ENDS

CODE SEGMENT
START:
    ; Initialize Data Segment
    MOV AX, DATA
    MOV DS, AX
    
    ; Load first operand
    MOV AL, OPR1
    
    ; Add second operand
    ADD AL, OPR2
    
    ; Clear high byte for 16-bit result
    MOV AH, 00H
    
    ; Store result
    MOV RES, AX
    
    ; Exit program
    MOV AH, 4CH
    INT 21H
CODE ENDS
END START
