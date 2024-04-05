---
title: Very Easy - Questionnaire
---
**Challenge Description**

It's time to learn some things about binaries and basic c. Connect to a remote server and answer some questions to get the flag.

## Questions

**Is this a '32-bit' or '64-bit' ELF? (e.g. 1337-bit)**

```bash
❯ file test
test: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=5a83587fbda6ad7b1aeee2d59f027a882bf2a429, for GNU/Linux 3.2.0, not stripped
```

**Answer:** 64-bit

**What's the linking of the binary? (e.g. static, dynamic)**

```bash
❯ file test
test: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=5a83587fbda6ad7b1aeee2d59f027a882bf2a429, for GNU/Linux 3.2.0, not stripped
```

**Answer:** dynamic

**Is the binary 'stripped' or 'not stripped'?**

```bash
❯ file test
test: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=5a83587fbda6ad7b1aeee2d59f027a882bf2a429, for GNU/Linux 3.2.0, not stripped
```

**Answer:** not stripped

**Which protections are enabled (Canary, NX, PIE, Fortify)?**

```bash
❯ gdb test
gdb-peda$ checksec

CANARY    : disabled
FORTIFY   : disabled
NX        : ENABLED
PIE       : disabled
RELRO     : Partial
```

**Answer:** NX

**What is the name of the custom function the gets called inside `main()`? (e.g. vulnerable_function())**

```c
#include <stdio.h>
#include <stdlib.h>

/*
This is not the challenge, just a template to answer the questions.
To get the flag, answer the questions. 
There is no bug in the questionnaire.
*/

void gg(){
    system("cat flag.txt");
}

void vuln(){
    char buffer[0x20] = {0};
    fprintf(stdout, "\nEnter payload here: ");
    fgets(buffer, 0x100, stdin);
}

void main(){
    vuln();
}
```

**Answer:** vuln()

**What is the size of the 'buffer' (in hex or decimal)?**

```c
void vuln(){
    char buffer[0x20] = {0};
    fprintf(stdout, "\nEnter payload here: ");
    fgets(buffer, 0x100, stdin);
}
```

**Answer:** 0x20

**Which custom function is never called? (e.g. vuln())**

```c
void gg(){
    system("cat flag.txt");
}
```

**Answer:** gg()

**What is the name of the standard function that could trigger a Buffer Overflow? (e.g. fprintf())**

```c
void vuln(){
    char buffer[0x20] = {0};
    fprintf(stdout, "\nEnter payload here: ");
    fgets(buffer, 0x100, stdin);
}
```

**Answer:** fgets()

**After how many bytes a Segmentation Fault occurs (in hex or decimal)?**

```bash
❯ gdb test
gdb-peda$ pattern create 50

'AAA%AAsAABAA$AAnAACAA-AA(AADAA;AA)AAEAAaAA0AAFAAbA'

gdb-peda$ r

Enter payload here: AAA%AAsAABAA$AAnAACAAAA(AADAA;AA)AAEAAaAA0AAFAAbA

gdb-peda$ pattern search

Registers contain pattern buffer:
RBP+0 found at offset: 32
Registers point to pattern buffer:
[RAX] --> offset 0 - size ~52
[RSI] --> offset 1 - size ~51
[RSP] --> offset 40 - size ~12
Pattern buffer found at:
0x004056b0 : offset    0 - size   50 ([heap])
0x00007fffffffd790 : offset 37729 - size    4 ($sp + -0x328 [-202 dwords])
0x00007fffffffda90 : offset    0 - size   50 ($sp + -0x28 [-10 dwords])
0x00007fffffffdfd0 : offset 37729 - size    4 ($sp + 0x518 [326 dwords])
0x00007fffffffefa2 : offset 37729 - size    4 ($sp + 0x14ea [1338 dwords])
0x00007fffffffeff3 : offset 37729 - size    4 ($sp + 0x153b [1358 dwords])
```

```
[RSP] --> offset 40 - size ~12
```

**Answer:** 40

**What is the address of 'gg()' in hex? (e.g. 0x401337)**

```bash
gdb-peda$ p gg
$1 = {<text variable, no debug info>} 0x401176 <gg>
```

**Answer:** 0x401176

Great job! It's high time you solved your first challenge! Here is the flag!

**HTB{l34rn_th3_b451c5_\*\*\*\*\*\*\_u_5t4rt}**

Reference: 

- https://app.hackthebox.com/challenges/Questionnaire