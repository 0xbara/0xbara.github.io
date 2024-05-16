---
title: Very Easy - Ancient Encodings
tags:
  - crypto
---
Your initialization sequence requires loading various programs to gain the necessary knowledge and skills for your journey. Your first task is to learn the ancient encodings used by the aliens in their communication.
## Code

```python
from Crypto.Util.number import bytes_to_long
from base64 import b64encode
from secret import FLAG


def encode(message):
    return hex(bytes_to_long(b64encode(message)))


def main():
    encoded_flag = encode(FLAG)
    with open("output.txt", "w") as f:
        f.write(encoded_flag)


if __name__ == "__main__":
    main()
```

## Imports

```python
from Crypto.Util.number import bytes_to_long
from base64 import b64encode
from secret import FLAG
```

- `bytes_to_long`: A function from the `Crypto.Util.number` library that converts a sequence of bytes to a long integer.
- `b64encode`: A function from the `base64` library that encodes data into a base64 string.
- `FLAG`: A variable imported from the `secret` module that contains the secret message we want to encode.
 
## `encode` Function

```python
def encode(message):
    return hex(bytes_to_long(b64encode(message)))
```

This function takes a message in byte format and processes it in two steps:

1. `b64encode(message)`: Encodes the message into base64, returning a bytes object.
2. `bytes_to_long(b64encode(message))`: Converts this base64 byte string into a long integer.
3. `hex(...)`: Converts that long integer into a hexadecimal string.

For example, if `message` is `b'Hello'`:

- `b64encode(b'Hello')` returns `b'SGVsbG8='`.
- `bytes_to_long(b'SGVsbG8=')` converts `b'SGVsbG8='` into a long integer.
- `hex(...)` converts that long integer into a hexadecimal string.

## Main Function

```python
def main():
    encoded_flag = encode(FLAG)
    with open("output.txt", "w") as f:
        f.write(encoded_flag)
```

This function does the following:

1. Calls the `encode` function with `FLAG` as the argument and stores the result in `encoded_flag`.
2. Opens (or creates if it doesn't exist) a file named `output.txt` in write mode (`"w"`).
3. Writes the contents of `encoded_flag` to the `output.txt` file.

## Script Execution

```python
if __name__ == "__main__":
    main()
```

This block ensures that `main()` runs only if the script is executed directly (not if it's imported as a module in another script).

## Summary

The code takes a secret message (`FLAG`), first encodes it in base64, then converts that base64 representation into a long integer, and finally converts that long integer into a hexadecimal string. This hexadecimal string is then saved to a file named `output.txt`. This process provides a way to encode and store the message in a form that is not easily recognizable in its original format.

This multi-step encoding approach can be useful in situations where you want to transform data so that it is not easily recognizable, although it does not provide strong cryptographic security on its own.

## Decrypt

### The Bash One-Liner

Assuming your bash one-liner reads the `output.txt` file and decodes it back to the original message, it would likely look something like this:

```bash
echo $(cat output.txt) | xxd -r -ps | base64 -d; echo
```

Here's what each part does:

1. `cat output.txt`: Reads the contents of `output.txt`.
2. `echo $(cat output.txt)`: Prints the contents of `output.txt` as a string.
3. `xxd -r -p`: Converts the hexadecimal string back to binary data.
4. `base64 -d`: Decodes the binary data from base64 back to the original message.

### Decrypting in Python

To perform the decryption (or rather decoding) in Python, we need to reverse the encoding steps:

1. Convert the hexadecimal string back to a long integer.
2. Convert the long integer back to a base64-encoded byte string.
3. Decode the base64 byte string back to the original message.

Here’s how you can achieve this:

```python
from Crypto.Util.number import long_to_bytes
from base64 import b64decode

def decode(encoded_message):
    # Remove the '0x' prefix and convert the hex string to an integer
    long_value = int(encoded_message, 16)
    # Convert the long integer back to bytes
    base64_encoded_bytes = long_to_bytes(long_value)
    # Decode the base64-encoded bytes to get the original message
    message = b64decode(base64_encoded_bytes)
    return message

def read_encoded_message():
    with open("output.txt", "r") as f:
        encoded_message = f.read().strip()
    return encoded_message

if __name__ == "__main__":
    encoded_message = read_encoded_message()
    original_message = decode(encoded_message)
    print("Original Message:", original_message.decode())
```
### Explanation

**Convert Hex String to Long Integer**

```python
long_value = int(encoded_message, 16)
```

This converts the hexadecimal string back into a long integer.

**Convert Long Integer to Bytes**

```python
base64_encoded_bytes = long_to_bytes(long_value)
```

This converts the long integer back into a byte string, which is still base64 encoded.

**Decode Base64-Encoded Bytes**

```python
message = b64decode(base64_encoded_bytes)
```

This decodes the base64-encoded byte string back into the original message in bytes.

**Read the Encoded Message from File**

```python
def read_encoded_message():
    with open("output.txt", "r") as f:
        encoded_message = f.read().strip()
    return encoded_message
```

This reads the hexadecimal string from the `output.txt` file.

**Main Execution**

```python
if __name__ == "__main__":
    encoded_message = read_encoded_message()
    original_message = decode(encoded_message)
    print("Original Message:", original_message.decode())
```

This reads the encoded message, decodes it, and prints the original message.

This Python script effectively reverses the encoding process performed by the original script, restoring the original message.