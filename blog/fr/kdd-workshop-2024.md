---
title: 'KDD 2024 : Discussion avec Amazon'
date: '2025-01-29'
keywords: 'KDD 2024,Modèles de Langage de Grande Taille,LLM,Génération Augmentée par Récupération,RAG,Affinage de LLM,Amazon,IA spécifique au domaine,apprentissage automatique,conférence'
image: '/images/solutions/kdd-2024-cover.jpeg'
---

![Conférence KDD 2024](/images/solutions/kdd-2024-cover.jpeg)
_Rachel Hu présentant à la conférence KDD 2024_

Lors de la conférence KDD 2024, [Rachel Hu](https://www.linkedin.com/in/rachelsonghu/), co-fondatrice et PDG de CambioML, a présenté un tutoriel complet sur l'optimisation des Modèles de Langage de Grande Taille (LLMs) pour des applications spécifiques à un domaine, aux côtés de co-présentateurs [José Cassio dos Santos Junior](https://www.linkedin.com/in/jcassiojr/) (Amazon), [Richard Song](https://www.linkedin.com/in/renchu-richard-song-a4099247/) (Epsilla) et [Yunfei Bai](https://www.linkedin.com/in/yunfei-felix-bai-909b861/) (Amazon). La session a fourni des informations approfondies sur deux techniques critiques : la Génération Augmentée par Récupération (RAG) et l'Affinage de LLM. Ces méthodes sont essentielles pour améliorer les performances des LLM dans des domaines spécialisés, permettant aux développeurs de créer des modèles plus efficaces et précis adaptés à des tâches spécifiques.

## Comprendre RAG : Élargir les capacités des LLM

La Génération Augmentée par Récupération (RAG) est une approche puissante qui étend les capacités des LLM en intégrant des bases de connaissances externes. Cette technique permet aux LLM de générer des réponses basées sur des connaissances spécifiques à un domaine sans nécessiter de réentraînement extensif. RAG est particulièrement bénéfique pour les organisations qui doivent tirer parti de bases de connaissances internes ou d'autres ressources spécialisées, offrant un moyen d'améliorer les performances des LLM de manière rentable et efficace en termes de temps.

## Affinage : Adapter les modèles pour la précision

L'Affinage de LLM implique l'ajustement des poids du modèle en utilisant des données spécifiques à un domaine, permettant au modèle d'apprendre systématiquement de nouvelles connaissances complètes qui n'étaient pas incluses lors de la phase de pré-entraînement. Cette approche est essentielle pour les tâches nécessitant un haut degré de précision et est particulièrement efficace dans les domaines où les modèles à usage général sont insuffisants. L'Affinage peut transformer un LLM en un outil hautement spécialisé, capable d'effectuer des tâches complexes et spécifiques à un domaine avec précision.

![Rachel Hu présentant à KDD](/images/solutions/kdd-2024-rachel.jpeg)

## Combiner RAG et Affinage pour des résultats optimaux

Le tutoriel a exploré comment la combinaison de RAG et de l'Affinage peut créer une architecture robuste pour les applications LLM. En intégrant ces deux approches, les développeurs peuvent construire des modèles qui non seulement accèdent aux informations externes les plus pertinentes, mais apprennent également à partir de données spécifiques à un domaine. Cette approche hybride permet de créer des modèles à la fois polyvalents et hautement précis, capables de gérer une large gamme de tâches spécifiques à un domaine, allant de la génération de texte à des scénarios complexes de questions-réponses.

## Ateliers pratiques : Applications concrètes de RAG et d'Affinage

Une partie importante du tutoriel de Rachel était consacrée à des ateliers pratiques, où les participants ont exploré des techniques avancées pour optimiser les architectures RAG et LLM affinées. Les ateliers ont couvert une variété de sujets, y compris :

- **Techniques avancées de RAG** : Des stratégies d'optimisation en plusieurs phases ont été démontrées pour améliorer la précision et la pertinence des résultats de RAG. Cela incluait l'optimisation pré-récupération, récupération et post-récupération, ainsi que l'utilisation innovante de graphes de connaissances et d'analyses multi-documents pour un raisonnement plus nuancé.

- **Affinage des LLM** : Les participants se sont engagés dans l'affinage d'un petit LLM en utilisant des ensembles de données spécifiques à un domaine. L'atelier a mis en évidence le processus d'affinage continu, intégrant à la fois les retours humains et ceux de l'IA pour atteindre des performances supérieures dans des tâches spécialisées.

- **Évaluation et benchmarking** : Le dernier atelier était axé sur la comparaison des performances de RAG, de l'Affinage et de leur approche combinée à travers diverses tâches. Cela incluait une analyse ROI détaillée pour aider les développeurs à choisir la méthode la plus rentable et efficace pour leurs besoins spécifiques.

![Ateliers KDD 2024](/images/solutions/kdd-2024-labs.jpg)

## Meilleures pratiques pour le développement de LLM spécifiques à un domaine

Le tutoriel s'est conclu par un ensemble de meilleures pratiques pour mettre en œuvre RAG et l'Affinage dans des applications réelles. En soulignant l'importance de comprendre les compromis entre la flexibilité de RAG et la précision de l'Affinage, les participants ont été encouragés à s'engager dans une expérimentation continue et un benchmarking. Cette approche garantit que les critères de performance et de rentabilité sont respectés, permettant aux développeurs d'optimiser efficacement leur architecture LLM pour des tâches spécifiques à un domaine.

Pour un aperçu plus détaillé du contenu du tutoriel et des ateliers pratiques, veuillez consulter [ce document](https://dl.acm.org/doi/abs/10.1145/3637528.3671445) et [cette présentation](https://docs.google.com/presentation/d/18PJctnI-KbABE1El_AifjN_7eoHatuaoN8-2q57xpSw/edit#slide=id.g2f5cc21ff85_5_1096).
