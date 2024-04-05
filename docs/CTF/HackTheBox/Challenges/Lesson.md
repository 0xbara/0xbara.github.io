---
title: Very Easy - Lesson
---
**Challenge Description**

It's time to learn some basic things about binaries and basic c. Answer some questions to get the flag.

## Questions

**Is this a '32-bit' or '64-bit' ELF? (e.g. 1337-bit)**

```bash
❯ file main
main: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked, interpreter ./glibc/ld-linux-x86-64.so.2, BuildID[sha1]=da663acb70f9fa157a543a6c4affd05e53fbcb07, for GNU/Linux 3.2.0, not stripped
```

**Answer:** 64-bit

**Which of these 3 protections are enabled (Canary, NX, PIE)?**

```
❯ gdb main
gdb-peda$ checksec

CANARY    : disabled
FORTIFY   : disabled
NX        : ENABLED
PIE       : disabled
RELRO     : FULL
```

**Answer:** NX

**What do you need to enter so the message 'Welcome admin!' is printed?**

```c
#include <stdio.h>

void under_construction(){
  printf("This is under development\n");
}

void print_msg(char *user){
  char formatter[0x20];
  strncpy(formatter, user, 5);
  for (size_t i = 0; i < 5; i++) formatter[i] = tolower(formatter[i]);
  printf(strncmp(formatter, "admin", 5) == 0 ? "\nWelcome admin!\n\n" : "\nWelcome user!\n\n");  
}

int main(int argc, char **argv){
  char name[0x20] = {0};
  unsigned long x, y;
  printf("Enter your name: ");
  scanf("%s", name);
  print_msg(name);
  return 0;
}
```

```
❯ ./main
Enter your name: admin

Welcome admin!
```

**Answer:** admin

**What is the size of the 'name' buffer (in hex or decimal)?**

```c
char name[0x20] = {0};
```

**Answer:** 0x20

**Which custom function is never called? (e.g. vuln())**

```c
void under_construction(){
  printf("This is under development\n");
}
```

**Answer:** under_construction

**What is the name of the standard function that could trigger a Buffer Overflow? (e.g. fprintf())**

```c
int main(int argc, char **argv){
  char name[0x20] = {0};
  unsigned long x, y;
  printf("Enter your name: ");
  scanf("%s", name);
  print_msg(name);
  return 0;
}
```

**Answer:** scanf()

**After how many bytes a Segmentation Fault occurs (in hex or decimal)?**

```bash
gdb-peda$ pattern create 50
'AAA%AAsAABAA$AAnAACAA-AA(AADAA;AA)AAEAAaAA0AAFAAbA'

gdb-peda$ r
Enter your name: AAA%AAsAABAA$AAnAACAA-AA(AADAA;AA)AAEAAaAA0AAFAAbA

gdb-peda$ pattern search
Registers contain pattern buffer:
RBP+0 found at offset: 32
Registers point to pattern buffer:
[RSP] --> offset 40 - size ~10
[R9] --> offset 0 - size ~52
```

```
[RSP] --> offset 40
```

**Answer:** 40

**What is the address of 'under_construction()' in hex? (e.g. 0x401337)**

```bash
gdb-peda$ p under_construction
$1 = {<text variable, no debug info>} 0x4011d6 <under_construction>
```

**Answer:** 0x4011d6

Great job! It's high time you solved your first challenge! Here is the flag!

**HTB{w4rm35t_\*\*\*\*\*\*\_3v3r}**

Reference:

- https://app.hackthebox.com/challenges/Lesson