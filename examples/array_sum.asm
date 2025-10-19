; Array Sum Program
; Calculate the sum of an array of numbers
; Author: ASM-Studio Pro
; Date: 2025-10-16

ASSUME CS:CODE, DS:DATA

DATA SEGMENT
    ARRAY DB 10H, 20H, 30H, 40H, 50H    ; Array of 5 numbers
    COUNT DB 5                           ; Number of elements
    SUM DW ?                             ; Sum result (16-bit)
DATA ENDS

CODE SEGMENT
START:
    ; Initialize Data Segment
    MOV AX, DATA
    MOV DS, AX
    
    ; Initialize registers
    MOV CX, 0              ; Clear CX
    MOV CL, COUNT          ; Load count into CL (loop counter)
    MOV SI, 0              ; SI = array index (starts at 0)
    MOV AX, 0              ; AX = accumulator for sum
    
SUM_LOOP:
    ; Add current array element to sum
    MOV BL, ARRAY[SI]      ; Load ARRAY[SI] into BL
    ADD AL, BL             ; Add to AL (low byte of sum)
    ADC AH, 0              ; Add carry to AH (high byte)
    
    ; Move to next element
    INC SI
    
    ; Loop until all elements processed
    LOOP SUM_LOOP
    
    ; Store final sum
    MOV SUM, AX
    
    ; Exit program
    MOV AH, 4CH
    INT 21H
CODE ENDS
END START
