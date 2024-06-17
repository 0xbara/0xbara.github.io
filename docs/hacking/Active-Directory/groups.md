---
title: Security Groups
tags:
  - active-directory
---
## Theory

>In the Windows Server operating system, there are several built-in accounts and security groups that are pre-configured with the appropriate rights and permissions to perform specific tasks. ([Microsoft](https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/dn579255(v=ws.11)?redirectedfrom=MSDN))

There are scenarios where testers can obtain full control over members of built-in security groups. The usual targets are members of the "Administrators", "Domain Admins" or "Enterprise Admins" groups, however, other groups can sometimes lead to major privileges escalation.

## Default Active Directory Security Groups and Abuse Paths

1. **Access Control Assistance Operators**
	   - **Rights:** Assist in managing access permissions.
	   - **Abuse:** Can be used to modify access permissions for unauthorized access.

2. **Account Operators**
	   - **Rights:** Manage user and group accounts, including modifying domain controller settings.
	   - **Abuse:** Can abuse user accounts with unconstrained delegations; escalate to "Enterprise Key Admins" and gain full root domain control.

3. **Administrators**
	   - **Rights:** Full admin rights to the domain and domain controllers.
	   - **Abuse:** Complete control over the domain infrastructure, allowing for widespread manipulation.

4. **Allowed RODC Password Replication**
	   - **Rights:** Define accounts allowed for password replication to RODCs.
	   - **Abuse:** Can be exploited to gain access to RODC-replicated credentials.

5. **Backup Operators**
	   - **Rights:** Backup and restore Active Directory, logon rights to domain controllers.
	   - **Abuse:** Remotely backup registry hives to dump SAM & LSA secrets, conduct DCSync attacks.

6. **Certificate Service DCOM Access**
	   - **Rights:** Request certificates via DCOM.
	   - **Abuse:** Issue unauthorized certificates to impersonate users or computers.

7. **Cert Publishers**
	   - **Rights:** Publish certificates to Active Directory.
	   - **Abuse:** Publish rogue certificates for unauthorized access.

8. **Cloneable Domain Controllers**
	   - **Rights:** Define domain controllers that can be cloned.
	   - **Abuse:** Clone domain controllers for unauthorized use and potential data exfiltration.

9. **Cryptographic Operators**
	   - **Rights:** Perform cryptographic operations.
	   - **Abuse:** Manipulate cryptographic operations to compromise data integrity.

10. **Denied RODC Password Replication**
    - **Rights:** Define accounts denied from password replication to RODCs.
    - **Abuse:** Misuse this group to inadvertently exclude critical accounts from security policies.

11. **Device Owners**
    - **Rights:** Manage devices within the domain.
    - **Abuse:** Gain control over devices to install unauthorized software or access sensitive data.

12. **DHCP Administrators**
    - **Rights:** Manage the DHCP service.
    - **Abuse:** Manipulate DHCP settings to redirect network traffic for man-in-the-middle attacks.

13. **DHCP Users**
    - **Rights:** Read-only access to the DHCP service.
    - **Abuse:** Monitor DHCP configurations to gather network information.

14. **Distributed COM Users**
    - **Rights:** Launch, activate, and use DCOM objects.
    - **Abuse:** Exploit DCOM permissions to run malicious code.

15. **DnsUpdateProxy**
    - **Rights:** Facilitate dynamic DNS updates.
    - **Abuse:** Update DNS records for unauthorized redirection or spoofing.

16. **DnsAdmins**
    - **Rights:** Manage the DNS service.
    - **Abuse:** Edit DNS records to redirect traffic, run code via DLL injection on a Domain Controller.

17. **Domain Admins**
    - **Rights:** Full admin rights over the domain.
    - **Abuse:** Total control over the domain for extensive abuse opportunities.

18. **Domain Computers**
    - **Rights:** Contains all computers joined to the domain.
    - **Abuse:** Manipulate computer accounts to deploy malicious policies.

19. **Domain Controllers**
    - **Rights:** Contains all domain controllers.
    - **Abuse:** Control domain controllers for unauthorized access and replication.

20. **Domain Guests**
    - **Rights:** Contains all guest accounts in the domain.
    - **Abuse:** Elevate guest privileges to access restricted resources.

21. **Domain Users**
    - **Rights:** Contains all user accounts in the domain.
    - **Abuse:** Leverage user accounts for phishing and social engineering.

22. **Enterprise Admins**
    - **Rights:** Full admin rights to the AD forest.
    - **Abuse:** Forest-wide control for extensive administrative abuse.

23. **Enterprise Key Admins**
    - **Rights:** Manage encryption keys at the enterprise level.
    - **Abuse:** Compromise encryption keys to access sensitive data.

24. **Enterprise Read-only Domain Controllers**
    - **Rights:** Contains all read-only domain controllers.
    - **Abuse:** Exploit read-only domain controllers for replication data.

25. **Event Log Readers**
    - **Rights:** Read event logs.
    - **Abuse:** Monitor and manipulate event logs to hide malicious activity.

26. **Group Policy Creator Owners**
    - **Rights:** Create and modify group policy objects.
    - **Abuse:** Deploy malicious group policies to control user and computer behavior.

27. **Guests**
    - **Rights:** Contains all guest accounts.
    - **Abuse:** Escalate guest accounts for broader access.

28. **Hyper-V Administrators**
    - **Rights:** Manage Hyper-V.
    - **Abuse:** Control virtual environments for unauthorized virtual machine deployment.

29. **IIS_IUSRS**
    - **Rights:** Used by IIS to grant permissions to web applications.
    - **Abuse:** Exploit web application permissions for web-based attacks.

30. **Incoming Forest Trust Builders**
    - **Rights:** Create incoming trust relationships with other forests.
    - **Abuse:** Establish trust relationships to extend attack vectors across forests.

31. **Key Admins**
    - **Rights:** Manage encryption keys.
    - **Abuse:** Compromise encryption keys for unauthorized access.

32. **Network Configuration Operators**
    - **Rights:** Manage network configuration.
    - **Abuse:** Change network settings for unauthorized data interception.

33. **Performance Log Users**
    - **Rights:** Access performance logs.
    - **Abuse:** Monitor system performance to identify and exploit weaknesses.

34. **Performance Monitor Users**
    - **Rights:** Monitor system performance.
    - **Abuse:** Leverage performance data to optimize attacks.

35. **Pre–Windows 2000 Compatible Access**
    - **Rights:** Access for users and groups with permissions inherited from older versions.
    - **Abuse:** Exploit legacy permissions for unauthorized access.

36. **Print Operators**
    - **Rights:** Manage printers.
    - **Abuse:** Deploy print spooler exploits to gain elevated privileges.

37. **Protected Users**
    - **Rights:** Enhance security for member user accounts.
    - **Abuse:** Target protected users for high-value attacks.

38. **RAS and IAS Servers**
    - **Rights:** Run remote access and authentication services.
    - **Abuse:** Compromise RAS servers to intercept remote access credentials.

39. **RDS Endpoint Servers**
    - **Rights:** Manage RDS endpoint servers.
    - **Abuse:** Exploit RDS endpoints for unauthorized remote access.

40. **RDS Management Servers**
    - **Rights:** Manage RDS management servers.
    - **Abuse:** Control RDS management for extensive remote desktop access.

41. **RDS Remote Access Servers**
    - **Rights:** Manage RDS remote access servers.
    - **Abuse:** Exploit remote access servers for unauthorized entry points.

42. **Read-only Domain Controllers**
    - **Rights:** Contains all read-only domain controllers.
    - **Abuse:** Use read-only domain controllers to gather replication data.

43. **Remote Desktop Users**
    - **Rights:** Log in via Remote Desktop.
    - **Abuse:** Gain remote desktop access to internal systems.

44. **Remote Management Users**
    - **Rights:** Perform remote management tasks.
    - **Abuse:** Leverage remote management to control systems remotely.

45. **Replicator**
    - **Rights:** Used by the file replication service.
    - **Abuse:** Manipulate file replication for data exfiltration.

46. **Schema Admins**
    - **Rights:** Modify the Active Directory schema.
    - **Abuse:** Alter schema to introduce backdoors or disable security features.

47. **Server Operators**
    - **Rights:** Perform administrative tasks on servers.
    - **Abuse:** Control server operations, change binaries, and manipulate services.

48. **Storage Replica Administrators**
    - **Rights:** Manage storage replication.
    - **Abuse:** Compromise storage replication for data corruption or loss.

49. **System Managed Accounts**
    - **Rights:** Contains system-managed service accounts.
    - **Abuse:** Exploit service accounts for persistent access.

50. **Terminal Server License Servers**
    - **Rights:** Manage Terminal Server license servers.
    - **Abuse:** Manipulate licensing to disrupt or control terminal server access.

51. **Users**
    - **Rights:** Contains all default user and service accounts.
    - **Abuse:** Use default accounts for initial access and privilege escalation.

52. **Windows Authorization Access**
    - **Rights:** Access user authorization information.
    - **Abuse:** Leverage authorization information to bypass security controls.

53. **WinRMRemoteWMIUsers_**
    - **Rights:** Access Windows Remote Management and WMI remotely.
    - **Abuse:** Use remote management to execute code and manage systems without physical access.

This revised list should provide a clear and concise overview of the default Active Directory security groups, along with potential abuse paths.

**Reference:**

- https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/understand-security-groups