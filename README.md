<!--
  ════════════════════════════════════════════════════════════════════
  README FLAGSHIP — dépôt Dadou1985/MySweetHotelPro
  Remplace ce fichier README.md à la racine du dépôt.
  À compléter avant publication :
    - les captures d'écran (remplace les liens placeholder)
    - la commande d'installation réelle si différente
    - le numéro de couverture de tests si tu le connais
  ════════════════════════════════════════════════════════════════════
-->

<div align="center">

# 🏨 My Sweet Hotel Pro

**Application métier d'un SaaS de gestion hôtelière, en production.**
Outil quotidien du personnel hôtelier : relation client, communication multilingue, suivi opérationnel et pilotage de l'établissement.

[🚀 Application mobile](https://github.com/Dadou1985/MySweetHotel) · [🚀 Application](https://mysweethotelpro.com/) · [⚙️ API (back-office)](https://github.com/Dadou1985/MSH-BackOffice)

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

</div>

---

## 📌 En bref

My Sweet Hotel Pro est l'une des trois applications de la plateforme **My Sweet Hotel**, une solution digitale qui aide les hôteliers à moderniser la gestion de leurs établissements. La plateforme se décline en deux entités indépendantes mais complémentaires :

- **My Sweet Hotel Pro** *(ce dépôt)* — l'application **destinée au personnel** de l'hôtel.
- **My Sweet Hotel** — l'application **destinée aux clients** de l'hôtel.

Ce dépôt couvre le front métier ; il s'appuie sur l'API **[MSH-BackOffice](https://github.com/Dadou1985/MSH-BackOffice)** (Node / TypeScript, GraphQL, temps réel) pour les données et la logique serveur.

> 💡 **Mon rôle :** conception et développement de bout en bout — architecture front, intégration de l'API GraphQL et du temps réel, internationalisation, mise en place des tests, de la conteneurisation et du pipeline de déploiement.

---

## ✨ Fonctionnalités

| | Fonctionnalité | Description |
|---|---|---|
| 📖 | **Instruction book** | Base de procédures internes de l'établissement |
| 💬 | **Chat multilingue** | Messagerie avec traduction automatique en 5 langues |
| 👥 | **CRM** | Gestion de la relation client |
| 🧳 | **Lost & found** | Suivi des objets trouvés |
| 📊 | **Dashboard** | Indicateurs et métriques de l'hôtel |
| ✅ | **Checklist editor** | Création et suivi de check-lists opérationnelles |
| 🚕 | **VTC call scheduler** | Planification des courses VTC |
| ⏰ | **Wake-up call scheduler** | Planification des réveils clients |
| 🔧 | **Maintenance book** | Carnet de maintenance |
| 💶 | **Cash sheet** | Suivi de caisse |
| 🎨 | **Custom visual generator** | Génération de visuels personnalisés |

---

## 🖼️ Captures d'écran

> _À remplacer par de vraies captures — c'est le point le plus important pour un visiteur qui ne peut pas exécuter le code._

| Tableau de bord | Chat multilingue |
|---|---|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Chat](docs/screenshots/chat.png) |

---

## 🏗️ Architecture

```
┌─────────────────────────────┐        GraphQL (queries / mutations)
│   My Sweet Hotel Pro        │  ───────────────────────────────────►   ┌──────────────────────────┐
│   (ce dépôt)                │                                         │   MSH-BackOffice (API)   │
│                             │  ◄───────────────────────────────────   │   Node · TypeScript      │
│   Gatsby · React · Zustand  │        Socket.IO (temps réel)           │   Apollo · Socket.IO     │
│   Bootstap · i18n           │                                         │   MongoDB · Redis · JWT  │
└─────────────────────────────┘                                         └──────────────────────────┘
```

Le front consomme l'API GraphQL pour les données et ouvre une connexion **Socket.IO** pour les notifications et le chat en temps réel. L'authentification repose sur des **JWT** délivrés par l'API.

---

## 🛠️ Stack technique

**Front-end**
- **Gatsby** (React) pour le rendu et l'organisation de l'application
- **Redux** pour la gestion d'état
- **Bootstrap** pour le styling
- **i18n** — internationalisation de l'interface (dossier `i18n/`) ; chat traduit en 5 langues

**Qualité & outillage**
- **Jest** + mocks pour les tests unitaires (`__tests__/`, `__mocks__/`)
- **Docker** / Docker Compose (dev & prod)
- **GitHub Actions** pour l'intégration et le déploiement continus
- **Firebase Hosting** (App Hosting) pour la mise en ligne

**Back-end** *(dépôt séparé)*
- [MSH-BackOffice](https://github.com/Dadou1985/MSH-BackOffice) — Node, TypeScript, Express, Apollo GraphQL, Socket.IO, MongoDB, Redis

---

## 🚀 Démo

L'application est en production. Pour la tester avec un accès dédié :

1. Envoie tes **nom, prénom et adresse** à [contact@mysweethotel.com](mailto:contact@mysweethotel.com)
2. Tu recevras des identifiants de connexion valables **48 h**
3. Connecte-toi sur [mysweethotelpro.com](https://mysweethotelpro.com/)

---

## 💻 Installation locale

> Le projet nécessite l'accès à l'API [MSH-BackOffice](https://github.com/Dadou1985/MSH-BackOffice) et aux services Firebase.

```bash
# Cloner le dépôt
git clone https://github.com/Dadou1985/MySweetHotelPro.git
cd MySweetHotelPro

# Installer les dépendances
npm install

# Lancer en développement
npm run develop
```

Configurer les variables d'environnement nécessaires (clés Firebase, URL de l'API…) dans un fichier `.env` avant de démarrer.

```bash
# Lancer les tests
npm test

# Déployer
npm run deploy
```

---

## 🧠 Choix techniques notables

- **Gatsby (React)** — un socle React structuré pour une application riche en écrans, avec un build optimisé et une bonne expérience de développement.
- **GraphQL + Socket.IO** — GraphQL pour des échanges de données précis et typés avec l'API, Socket.IO pour le temps réel (chat, notifications) là où une requête classique ne suffit pas.
- **Internationalisation native** — la traduction (5 langues) est pensée dès la conception, contrainte directe du secteur hôtelier international.
- **Conteneurisation & CI/CD** — Docker + GitHub Actions pour des déploiements reproductibles, du dev à la production.

---

## 👤 Auteur

**David Simba** — [@Dadou1985](https://github.com/Dadou1985) · [david.simba1985@gmail.com](mailto:david.simba1985@gmail.com)

## 📄 Licence

Distribué sous licence **MIT**.
