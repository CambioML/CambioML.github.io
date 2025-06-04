---
title: 'AnyParser On-prem Enterprise Security Whitepaper'
date: '2024-02-03'
keywords: "AnyParser,on-premise,sicurezza aziendale,privacy dei dati,parsing dei documenti,sicurezza dell'infrastruttura,crittografia,controllo degli accessi,conformità,whitepaper"
image: '/images/solutions/anyparser-performance-graph.png'
---

## Sommario Esecutivo

AnyParser On-prem è una soluzione all'avanguardia per il parsing dei documenti progettata per soddisfare i rigorosi requisiti di sicurezza delle moderne imprese. Questo whitepaper delinea le robuste misure di sicurezza implementate in AnyParser On-prem, garantendo la privacy dei dati, la conformità normativa e l'efficienza operativa.

## 1. Introduzione

Nel panorama aziendale odierno, guidato dai dati, un efficiente parsing dei documenti è cruciale per semplificare le operazioni e i processi decisionali. Tuttavia, l'uso di modelli linguistici basati su cloud per il parsing di documenti sensibili introduce significativi rischi per la privacy dei dati. AnyParser On-prem affronta queste sfide fornendo una soluzione sicura, on-premises, che sfrutta la potenza di modelli linguistici avanzati mantenendo il completo controllo sui dati sensibili.

### Perché CambioML AnyParser si Distinguere: Velocità e Precisione

Il modello CambioML eccelle sia in velocità che in precisione, trovando il giusto equilibrio per molte esigenze aziendali. È più veloce della maggior parte dei modelli proprietari di grandi dimensioni, offrendo al contempo una maggiore precisione rispetto ai tradizionali sistemi di Riconoscimento Ottico dei Caratteri (OCR). Ciò significa che la tua azienda può ottenere il meglio di entrambi i mondi: un parsing dei documenti rapido e affidabile senza compromettere le prestazioni.

![Grafico delle Prestazioni di AnyParser](/images/solutions/anyparser-performance-graph.png)

Il grafico sopra confronta il throughput e la precisione di diversi modelli di parsing dei documenti.

- Asse X (Orizzontale): Rappresenta il "Throughput Medio (token/s)". Questo misura quanto rapidamente ciascun modello può elaborare il testo, con valori più alti che indicano velocità di elaborazione più elevate.

- Asse Y (Verticale): Rappresenta "Precisione". Questo misura quanto correttamente ciascun modello interpreta ed estrae informazioni dai documenti, con valori più alti che indicano migliori prestazioni.

Anyparser supera altri modelli sia in precisione (circa 0.82) che in throughput (circa 160 token/s), offrendo un equilibrio ottimale per le esigenze di parsing dei documenti aziendali.

## 2. Panoramica dell'Architettura di Sicurezza

AnyParser On-prem è progettato con un approccio incentrato sulla sicurezza, offrendo un'intera stack che va dal modello stesso all'infrastruttura di servizio. Questa soluzione completa può essere facilmente implementata in ambienti cloud privati come AWS, GCP e Azure.

### 2.1 Modello di Distribuzione

Il modello di distribuzione on-premises garantisce che tutto l'elaborazione dei dati avvenga all'interno dell'ambiente privato dell'organizzazione. Questo approccio elimina la necessità di trasmettere documenti sensibili al di fuori del controllo dell'azienda, affrontando le preoccupazioni relative alla sovranità dei dati e alla conformità normativa.

### 2.2 Sicurezza dell'Infrastruttura

AnyParser On-prem sfrutta strumenti e pratiche standard del settore per una distribuzione sicura dell'infrastruttura:

- Terraform è utilizzato per configurare e gestire l'infrastruttura cloud, garantendo coerenza e riducendo il rischio di configurazioni errate.

- I container Docker vengono impiegati per isolare l'applicazione e le sue dipendenze, migliorando la sicurezza e la portabilità.

- La distribuzione su EC2 o EKS è gestita tramite Terraform, mantenendo i principi dell'infrastruttura come codice e abilitando il controllo delle versioni del processo di distribuzione.

### 2.3 Sicurezza della Rete

Per garantire accesso e comunicazione sicuri:

- Kong o Nginx è configurato come controller di ingresso, fornendo robusti strumenti di gestione del traffico e funzionalità di sicurezza.

- La configurazione DNS è implementata per un accesso interno senza soluzione di continuità, riducendo l'esposizione a minacce esterne.

![Design Cambio On-prem](/images/solutions/cambio-onprem-design.png)

## 3. Privacy e Protezione dei Dati

AnyParser On-prem affronta la necessità critica di privacy dei dati nel parsing dei documenti:

- Tutti i dati rimangono all'interno dell'ambiente privato dell'organizzazione, eliminando i rischi associati ai modelli proprietari basati su cloud.

- La soluzione è conforme ai requisiti normativi e alle politiche interne di protezione dei dati garantendo che i documenti sensibili non vengano inviati al di fuori dell'ambiente privato.

## 4. Controllo degli Accessi e Autenticazione

AnyParser On-prem implementa robusti meccanismi di controllo degli accessi e autenticazione, tra cui:

- Controllo degli accessi basato sui ruoli (RBAC) per garantire che solo il personale autorizzato possa accedere al sistema e ai dati elaborati.

- Autenticazione a più fattori (MFA) per una verifica utente migliorata.

- Audit e registrazione degli accessi regolari per monitorare e rivedere l'uso del sistema.

## 5. Crittografia

Per proteggere ulteriormente i dati sensibili, AnyParser On-prem offre ai clienti l'opzione di implementare:

- Crittografia dei dati a riposo utilizzando algoritmi di crittografia standard del settore.

- Crittografia in transito utilizzando protocolli TLS/SSL per tutte le comunicazioni di rete.

- Pratiche sicure di gestione delle chiavi per proteggere le chiavi di crittografia.

## 6. Monitoraggio Continuo e Risposta agli Incidenti

Per mantenere una solida postura di sicurezza, AnyParser On-prem offre ai clienti l'opzione di implementare:

- Monitoraggio in tempo reale dell'infrastruttura e dell'applicazione per potenziali minacce alla sicurezza.

- Valutazioni regolari delle vulnerabilità e test di penetrazione.

- Un piano di risposta agli incidenti ben definito per affrontare e mitigare prontamente gli incidenti di sicurezza.

## 7. Futuri Miglioramenti della Sicurezza

CambioML è impegnata nell'innovazione continua in materia di sicurezza. L'imminente opzione di distribuzione bare-metal basata su Kubernetes fornirà alle imprese un controllo e una flessibilità ancora maggiori nelle loro scelte infrastrutturali. Questo miglioramento consentirà alle organizzazioni di distribuire AnyParser On-prem sul proprio hardware, rafforzando ulteriormente il controllo dei dati, riducendo la latenza e ottimizzando gli ambienti operativi.

## 8. Prestazioni e Scalabilità

Mantenendo rigorose misure di sicurezza, AnyParser On-prem non compromette le prestazioni:

- La soluzione offre un equilibrio ottimale tra velocità e precisione, superando altri modelli in entrambe le metriche.

- Con una precisione di circa 0.82 e un throughput di circa 160 token/s, AnyParser On-prem soddisfa le esigenze di parsing dei documenti aziendali in modo efficiente.

## Conclusione

AnyParser On-prem fornisce una soluzione sicura, ad alte prestazioni e precisa per il parsing dei documenti che affronta le critiche preoccupazioni di sicurezza e privacy delle moderne imprese. Offrendo un modello di distribuzione on-premises, una robusta sicurezza dell'infrastruttura e un impegno per il miglioramento continuo, AnyParser On-prem consente alle organizzazioni di sfruttare la potenza del parsing avanzato dei documenti mantenendo il completo controllo sui propri dati sensibili.

## Invito all'Azione

Per le organizzazioni che desiderano trasformare i propri flussi di lavoro documentali senza compromettere la sicurezza, AnyParser On-prem offre una soluzione potente e sicura. Contatta CambioML oggi per [programmare una demo](https://www.cambioml.com/book-demo) o [iniziare una prova](https://www.cambioml.com/sandbox) e scoprire i vantaggi di un parsing dei documenti sicuro ed efficiente.
