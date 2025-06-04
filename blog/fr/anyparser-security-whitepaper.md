---
title: 'AnyParser On-prem Enterprise Security Whitepaper'
date: '2024-02-03'
keywords: "AnyParser,on-premise,sécurité des entreprises,confidentialité des données,analyse de documents,sécurité de l'infrastructure,chiffrement,contrôle d'accès,conformité,livre blanc"
image: '/images/solutions/anyparser-performance-graph.png'
---

## Résumé Exécutif

AnyParser On-prem est une solution d'analyse de documents à la pointe de la technologie, conçue pour répondre aux exigences de sécurité strictes des entreprises modernes. Ce livre blanc décrit les mesures de sécurité robustes mises en œuvre dans AnyParser On-prem, garantissant la confidentialité des données, la conformité réglementaire et l'efficacité opérationnelle.

## 1. Introduction

Dans le paysage commercial axé sur les données d'aujourd'hui, une analyse efficace des documents est cruciale pour rationaliser les opérations et les processus de prise de décision. Cependant, l'utilisation de modèles linguistiques basés sur le cloud pour analyser des documents sensibles introduit des risques significatifs pour la confidentialité des données. AnyParser On-prem répond à ces défis en fournissant une solution sécurisée sur site qui exploite la puissance de modèles linguistiques avancés tout en maintenant un contrôle total sur les données sensibles.

### Pourquoi CambioML AnyParser se Démarque : Vitesse et Précision

Le modèle CambioML excelle à la fois en vitesse et en précision, trouvant l'équilibre idéal pour de nombreux besoins commerciaux. Il est plus rapide que la plupart des grands modèles propriétaires tout en offrant une précision supérieure par rapport aux systèmes de reconnaissance optique de caractères (OCR) traditionnels. Cela signifie que votre entreprise peut bénéficier du meilleur des deux mondes : une analyse de documents rapide et fiable sans compromettre les performances.

![Graphique de Performance AnyParser](/images/solutions/anyparser-performance-graph.png)

Le graphique ci-dessus compare le débit et la précision de différents modèles d'analyse de documents.

- Axe X (Horizontal) : Représente le "Débit Moyen (tokens/s)". Cela mesure la rapidité avec laquelle chaque modèle peut traiter du texte, des valeurs plus élevées indiquant des vitesses de traitement plus rapides.

- Axe Y (Vertical) : Représente la "Précision". Cela mesure à quel point chaque modèle interprète et extrait correctement des informations des documents, des valeurs plus élevées indiquant de meilleures performances.

Anyparser surpasse d'autres modèles tant en précision (environ 0,82) qu'en débit (environ 160 tokens/s), offrant un équilibre optimal pour les besoins d'analyse de documents des entreprises.

## 2. Aperçu de l'Architecture de Sécurité

AnyParser On-prem est conçu avec une approche axée sur la sécurité, offrant une pile complète allant du modèle lui-même à l'infrastructure de service. Cette solution complète peut être provisionnée de manière transparente dans des environnements de cloud privé tels qu'AWS, GCP et Azure.

### 2.1 Modèle de Déploiement

Le modèle de déploiement sur site garantit que tout le traitement des données se déroule au sein de l'environnement privé de l'organisation. Cette approche élimine la nécessité de transmettre des documents sensibles en dehors du contrôle de l'entreprise, répondant ainsi aux préoccupations liées à la souveraineté des données et à la conformité réglementaire.

### 2.2 Sécurité de l'Infrastructure

AnyParser On-prem s'appuie sur des outils et des meilleures pratiques standard de l'industrie pour un déploiement sécurisé de l'infrastructure :

- Terraform est utilisé pour configurer et gérer l'infrastructure cloud, garantissant la cohérence et réduisant le risque de mauvaises configurations.

- Des conteneurs Docker sont utilisés pour isoler l'application et ses dépendances, améliorant ainsi la sécurité et la portabilité.

- Le déploiement sur EC2 ou EKS est géré via Terraform, maintenant les principes d'infrastructure en tant que code et permettant le contrôle de version du processus de déploiement.

### 2.3 Sécurité Réseau

Pour garantir un accès et une communication sécurisés :

- Kong ou Nginx est configuré en tant que contrôleur d'entrée, offrant des fonctionnalités robustes de gestion du trafic et de sécurité.

- La configuration DNS est mise en œuvre pour un accès interne sans faille, réduisant l'exposition aux menaces externes.

![Conception Cambio On-prem](/images/solutions/cambio-onprem-design.png)

## 3. Confidentialité et Protection des Données

AnyParser On-prem répond au besoin critique de confidentialité des données dans l'analyse de documents :

- Toutes les données restent au sein de l'environnement privé de l'organisation, éliminant les risques associés aux modèles propriétaires basés sur le cloud.

- La solution est conforme aux exigences réglementaires et aux politiques internes de protection des données en veillant à ce que les documents sensibles ne soient pas envoyés en dehors de l'environnement privé.

## 4. Contrôle d'Accès et Authentification

AnyParser On-prem met en œuvre des mécanismes robustes de contrôle d'accès et d'authentification, notamment :

- Un contrôle d'accès basé sur les rôles (RBAC) pour garantir que seules les personnes autorisées peuvent accéder au système et aux données analysées.

- Une authentification multi-facteurs (MFA) pour une vérification utilisateur renforcée.

- Des audits d'accès réguliers et des journaux pour surveiller et examiner l'utilisation du système.

## 5. Chiffrement

Pour protéger davantage les données sensibles, AnyParser On-prem offre aux clients la possibilité de mettre en œuvre :

- Le chiffrement des données au repos utilisant des algorithmes de chiffrement standard de l'industrie.

- Le chiffrement en transit utilisant des protocoles TLS/SSL pour toutes les communications réseau.

- Des pratiques de gestion des clés sécurisées pour protéger les clés de chiffrement.

## 6. Surveillance Continue et Réponse aux Incidents

Pour maintenir une posture de sécurité robuste, AnyParser On-prem offre aux clients la possibilité de mettre en œuvre :

- Une surveillance en temps réel de l'infrastructure et de l'application pour détecter les menaces potentielles à la sécurité.

- Des évaluations régulières des vulnérabilités et des tests d'intrusion.

- Un plan de réponse aux incidents bien défini pour traiter et atténuer rapidement les incidents de sécurité.

## 7. Améliorations Futures en Matière de Sécurité

CambioML s'engage à innover en continu en matière de sécurité. La prochaine option de déploiement basée sur Kubernetes bare-metal offrira aux entreprises un contrôle et une flexibilité encore plus grands dans leurs choix d'infrastructure. Cette amélioration permettra aux organisations de déployer AnyParser On-prem sur leur propre matériel, renforçant ainsi le contrôle des données, réduisant la latence et optimisant les environnements opérationnels.

## 8. Performance et Scalabilité

Tout en maintenant des mesures de sécurité strictes, AnyParser On-prem ne compromet pas les performances :

- La solution offre un équilibre optimal entre vitesse et précision, surpassant d'autres modèles dans les deux métriques.

- Avec une précision d'environ 0,82 et un débit d'environ 160 tokens/s, AnyParser On-prem répond efficacement aux besoins d'analyse de documents des entreprises.

## Conclusion

AnyParser On-prem fournit une solution d'analyse de documents sécurisée, performante et précise qui répond aux préoccupations critiques de sécurité et de confidentialité des entreprises modernes. En offrant un modèle de déploiement sur site, une sécurité d'infrastructure robuste et un engagement envers l'amélioration continue, AnyParser On-prem permet aux organisations d'exploiter la puissance de l'analyse avancée de documents tout en maintenant un contrôle total sur leurs données sensibles.

## Appel à l'Action

Pour les organisations cherchant à transformer leurs flux de travail documentaires sans compromettre la sécurité, AnyParser On-prem offre une solution puissante et sécurisée. Contactez CambioML dès aujourd'hui pour [planifier une démo](https://www.cambioml.com/book-demo) ou [commencer un essai](https://www.cambioml.com/sandbox) et découvrir les avantages d'une analyse de documents sécurisée et efficace.
