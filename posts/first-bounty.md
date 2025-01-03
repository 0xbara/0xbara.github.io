---
title: 'My First Bounty'
date: '2025-01-3'
---

### How did I get my first bounty?

One of the things that helped me the most was getting invitations to private programs. I achieved this by finding simple bugs in VDPs (Vulnerability Disclosure Programs), such as IDORs, BACs, and privilege escalations. Initially, all I got were two triages that gave me some points and plenty of invitations. However, most of those private programs were VDPs, with only a few Bug Bounty (BB) programs.

To make progress, I looked for collaborations in a private program. That’s when I met one of my current friends, @zorodeep. His help was invaluable, as he had accumulated many invitations to paid programs thanks to the information disclosure bugs he had found.

### The collaboration

@zorodeep suggested we work together on a property rental/sales page. It was a website with an IDOR-based architecture: every time a POST request was sent, there was an IDOR. The issue with these types of sites is that they are often full of duplicates. Many hunters have already tested them, and developers tend to ignore the reported problems.

With this in mind, we reported three fairly obvious IDORs. They were simple vulnerabilities that anyone could have found, and, as expected, all the reports were marked as duplicates.

### The challenge

How could we approach a situation like this: an IDOR-based application, negligent developers, and lots of hunters competing?

The answer was simple: explore the application a bit more deeply. It took us less than an hour to figure out how we could potentially delete the entire site. A "Critical"? Well, for the program admins, it was a "High." Since it was my first bounty, I couldn’t complain.

### The discovery

When creating a post, a request like this would appear:

```http
PUT /pta/properties/{id}
Host: web.gw.idorbased.es

```

The form (multipart/form-data) included typical data: property price, whether it was for rent or sale, among other things. The interesting part was an option called "draft," which allowed saving the post as a draft or publishing it. That’s when the idea came to me: what if we could transform a published post into a draft?

As it turned out, we could. We were able to convert a published post into a draft using the following request:

```http
PUT /pta/properties/drafts/{id}
Host: web.gw.idorbased.es

```

All we had to do was add the word "drafts" to the URL. I know it sounds basic, but many hunters overlook these kinds of details. Sending this request didn’t just edit the post; it completely rewrote it, effectively performing a "post takeover."

### Results

We decided not to publish any visual evidence to avoid issues with the program. The bounty was $500 USD, split between the two of us, so we each received $250 USD.

Thanks for reading.


