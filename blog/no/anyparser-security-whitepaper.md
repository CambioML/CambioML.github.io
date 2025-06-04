---
title: 'AnyParser On-prem Enterprise Security Whitepaper'
date: '2024-02-03'
keywords: 'AnyParser,on-premise,enterprise security,data privacy,document parsing,infrastructure security,encryption,access control,compliance,whitepaper'
image: '/images/solutions/anyparser-performance-graph.png'
---

## Executive Summary

AnyParser On-prem er en banebrytende løsning for dokumentbehandling som er designet for å møte de strenge sikkerhetskravene til moderne virksomheter. Dette hvitepapiret skisserer de robuste sikkerhetstiltakene som er implementert i AnyParser On-prem, og sikrer dataprivacy, overholdelse av forskrifter og operasjonell effektivitet.

## 1. Introduksjon

I dagens datadrevne forretningslandskap er effektiv dokumentbehandling avgjørende for å strømlinjeforme drifts- og beslutningsprosesser. Imidlertid introduserer bruken av skybaserte språkmodeller for behandling av sensitive dokumenter betydelige dataprivacy-risikoer. AnyParser On-prem adresserer disse utfordringene ved å tilby en sikker, lokal løsning som utnytter kraften til avanserte språkmodeller samtidig som den opprettholder full kontroll over sensitive data.

### Hvorfor CambioML AnyParser skiller seg ut: Hastighet og Nøyaktighet

CambioML-modellen utmerker seg både i hastighet og nøyaktighet, og finner den ideelle balansen for mange forretningsbehov. Den er raskere enn de fleste store proprietære modeller, samtidig som den gir høyere nøyaktighet sammenlignet med tradisjonelle optiske tegngjenkjenningssystemer (OCR). Dette betyr at virksomheten din kan oppnå det beste fra begge verdener—rask, pålitelig dokumentbehandling uten å ofre ytelse.

![AnyParser Performance Graph](/images/solutions/anyparser-performance-graph.png)

Grafen ovenfor sammenligner gjennomstrømning og nøyaktighet av forskjellige dokumentbehandlingsmodeller.

- X-akse (Horisontal): Representerer "Gjennomsnittlig gjennomstrømning (tokens/s)". Dette måler hvor raskt hver modell kan behandle tekst, med høyere verdier som indikerer raskere behandlingshastigheter.

- Y-akse (Vertikal): Representerer "Nøyaktighet". Dette måler hvor korrekt hver modell tolker og henter informasjon fra dokumenter, med høyere verdier som indikerer bedre ytelse.

AnyParser overgår andre modeller både i nøyaktighet (omtrent 0,82) og gjennomstrømning (rundt 160 tokens/s), og tilbyr en optimal balanse for dokumentbehandlingsbehovene til virksomheter.

## 2. Oversikt over Sikkerhetsarkitektur

AnyParser On-prem er designet med en sikkerhetsfokusert tilnærming, og tilbyr en helhetlig løsning fra modellen selv til serverinfrastrukturen. Denne omfattende løsningen kan sømløst implementeres i private sky-miljøer som AWS, GCP og Azure.

### 2.1 Distribusjonsmodell

Den lokale distribusjonsmodellen sikrer at all databehandling skjer innenfor organisasjonens private miljø. Denne tilnærmingen eliminerer behovet for å overføre sensitive dokumenter utenfor selskapets kontroll, og adresserer bekymringer knyttet til datavirksomhet og overholdelse av forskrifter.

### 2.2 Infrastruktur Sikkerhet

AnyParser On-prem utnytter bransjestandardverktøy og beste praksis for sikker distribusjon av infrastruktur:

- Terraform brukes til å sette opp og administrere skyinfrastruktur, og sikrer konsistens og reduserer risikoen for feilkonfigurasjoner.

- Docker-containere brukes til å isolere applikasjonen og dens avhengigheter, noe som forbedrer sikkerheten og portabiliteten.

- Distribusjon til EC2 eller EKS administreres gjennom Terraform, og opprettholder prinsippene for infrastruktur som kode og muliggjør versjonskontroll av distribusjonsprosessen.

### 2.3 Nettverkssikkerhet

For å sikre sikker tilgang og kommunikasjon:

- Kong eller Nginx settes opp som inngangskontroller, og gir robust trafikkstyring og sikkerhetsfunksjoner.

- DNS-konfigurasjon implementeres for sømløs intern tilgang, og reduserer eksponeringen for eksterne trusler.

![Cambio On-prem Design](/images/solutions/cambio-onprem-design.png)

## 3. Dataprivacy og Beskyttelse

AnyParser On-prem adresserer det kritiske behovet for dataprivacy i dokumentbehandling:

- All data forblir innenfor organisasjonens private miljø, og eliminerer risikoene knyttet til skybaserte proprietære modeller.

- Løsningen overholder regulatoriske krav og interne databeskyttelsespolitikker ved å sikre at sensitive dokumenter ikke sendes utenfor det private miljøet.

## 4. Tilgangskontroll og Autentisering

AnyParser On-prem implementerer robuste mekanismer for tilgangskontroll og autentisering, inkludert:

- Rollebasert tilgangskontroll (RBAC) for å sikre at kun autorisert personell kan få tilgang til systemet og behandlet data.

- Multi-faktor autentisering (MFA) for forbedret brukerverifisering.

- Regelmessige tilgangsrevisjoner og logging for å overvåke og gjennomgå systembruk.

## 5. Kryptering

For ytterligere å beskytte sensitive data, tilbyr AnyParser On-prem kundene muligheten til å implementere:

- Datakryptering i ro ved bruk av bransjestandard krypteringsalgoritmer.

- Kryptering under transport ved bruk av TLS/SSL-protokoller for all nettverkskommunikasjon.

- Sikker nøkkelhåndtering for å beskytte krypteringsnøkler.

## 6. Kontinuerlig Overvåking og Hendelsesrespons

For å opprettholde en robust sikkerhetsstilling tilbyr AnyParser On-prem kundene muligheten til å implementere:

- Sanntidsovervåking av infrastrukturen og applikasjonen for potensielle sikkerhetstrusler.

- Regelmessige sårbarhetsvurderinger og penetrasjonstesting.

- En veldefinert hendelsesresponsplan for å adressere og redusere sikkerhetshendelser raskt.

## 7. Fremtidige Sikkerhetsforbedringer

CambioML er forpliktet til kontinuerlig innovasjon innen sikkerhet. Den kommende bare-metal Kubernetes-baserte distribusjonsalternativet vil gi virksomheter enda større kontroll og fleksibilitet i sine infrastrukturvalg. Denne forbedringen vil tillate organisasjoner å distribuere AnyParser On-prem på sitt eget maskinvare, og ytterligere styrke datakontroll, redusere latens og optimalisere driftsmiljøer.

## 8. Ytelse og Skalerbarhet

Mens strenge sikkerhetstiltak opprettholdes, går ikke AnyParser On-prem på kompromiss med ytelsen:

- Løsningen tilbyr en optimal balanse mellom hastighet og nøyaktighet, og overgår andre modeller i begge målinger.

- Med en nøyaktighet på omtrent 0,82 og en gjennomstrømning på rundt 160 tokens/s, møter AnyParser On-prem effektivt dokumentbehandlingsbehovene til virksomheter.

## Konklusjon

AnyParser On-prem tilbyr en sikker, høyytelses og nøyaktig løsning for dokumentbehandling som adresserer de kritiske sikkerhets- og personvernhensynene til moderne virksomheter. Ved å tilby en lokal distribusjonsmodell, robust infrastruktur sikkerhet og en forpliktelse til kontinuerlig forbedring, gjør AnyParser On-prem det mulig for organisasjoner å utnytte kraften i avansert dokumentbehandling samtidig som de opprettholder full kontroll over sine sensitive data.

## Call to Action

For organisasjoner som ønsker å transformere sine dokumentarbeidsflyter uten å gå på kompromiss med sikkerheten, tilbyr AnyParser On-prem en kraftig og sikker løsning. Kontakt CambioML i dag for å [bestille en demo](https://www.cambioml.com/book-demo) eller [starte en prøveperiode](https://www.cambioml.com/sandbox) og opplev fordelene med sikker, effektiv dokumentbehandling.
