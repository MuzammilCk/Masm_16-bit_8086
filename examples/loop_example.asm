; Loop Example - Count from 1 to 5
; Demonstrates the LOOP instruction and CX register
; Author: MASM Studio
; Date: 2025-10-16

ASSUME CS:CODE, DS:DATA

DATA SEGMENT
    COUNTER DB 0       ; Will store final count
DATA ENDS

CODE SEGMENT
START:
    ; Initialize Data Segment
    MOV AX, DATA
    MOV DS, AX
    
    ; Set loop counter (CX = 5, loop 5 times)
    MOV CX, 5
    
    ; Initialize accumulator
    MOV AL, 0
    
LOOP_START:
    ; Increment counter
    INC AL
    
    ; Loop back if CX != 0
    ; LOOP automatically decrements CX and jumps if CX != 0
    LOOP LOOP_START
    
    ; Store final count
    MOV COUNTER, AL
    
    ; Exit program
    MOV AH, 4CH
    INT 21H
CODE ENDS
END START
