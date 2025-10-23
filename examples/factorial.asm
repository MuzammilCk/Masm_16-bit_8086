; Factorial Calculator
; Calculate factorial of a number (e.g., 5! = 120)
; Author: MASM Studio
; Date: 2025-10-16

ASSUME CS:CODE, DS:DATA

DATA SEGMENT
    NUM DB 5           ; Calculate factorial of 5
    RESULT DW ?        ; Result (16-bit)
DATA ENDS

CODE SEGMENT
START:
    ; Initialize Data Segment
    MOV AX, DATA
    MOV DS, AX
    
    ; Load number
    MOV CL, NUM        ; CL = number to calculate factorial
    MOV AX, 1          ; AX = result (start with 1)
    
    ; Check if NUM is 0 or 1
    CMP CL, 1
    JBE DONE           ; If NUM <= 1, factorial is 1
    
FACTORIAL_LOOP:
    ; Multiply AX by CL
    MUL CL             ; AX = AX * CL (result in AX)
    
    ; Decrement counter
    DEC CL
    
    ; Continue if CL > 1
    CMP CL, 1
    JA FACTORIAL_LOOP  ; Jump if CL > 1
    
DONE:
    ; Store result
    MOV RESULT, AX
    
    ; Exit program
    MOV AH, 4CH
    INT 21H
CODE ENDS
END START