# Dr. Marin Voica - Clinică ORL Website

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)

Website de prezentare și programări pentru **Dr. Marin Voica**, medic primar ORL cu peste 30 de ani de experiență, specializat în Rinoplastie, Rinoseptoplastie și Deviație de sept în București.

## 🚀 Tehnologii Folosite

Acest proiect este construit folosind un stack tehnologic modern pentru a asigura performanță înaltă, SEO de top și o experiență excelentă de utilizare (UX):

- **Framework:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Limbaj:** [TypeScript](https://www.typescriptlang.org/)
- **Stilizare:** [Tailwind CSS](https://tailwindcss.com/)
- **Componente UI:** [shadcn/ui](https://ui.shadcn.com/) (bazat pe Radix UI primitives)
- **Animații & Carousel:** [Embla Carousel](https://www.embla-carousel.com/), [Tailwindcss Animate](https://github.com/jamiebuilds/tailwindcss-animate)
- **Routing:** [React Router v6](https://reactrouter.com/)
- **Formulare:** React Hook Form + Zod

## ✨ Funcționalități Principale

- **Design Responsiv:** Interfață adaptată și testată pe toate dispozitivele (mobil, tabletă, desktop).
- **Sistem Automatizat de Galerii Foto:**
  - Paginile de proceduri și pagina de Galerie preiau și afișează **automat** fotografiile pacienților dintr-un folder specific. 
  - Aliniere perfectă a pozelor "Înainte/După" și carusel interactiv, fără a necesita modificări în cod.
- **Optimizare SEO:** Meta tag-uri Open Graph, Twitter Cards, Schema.org JSON-LD pentru rich snippets (MedicalBusiness/Physician), structură semantică optimizată.
- **Performanță:** Generare rapidă a modulelor cu Vite, încărcare optimizată a imaginilor.

## 📂 Structura Proiectului

```text
src/
├── assets/         # Imagini statice și foldere automate (galerie/, proceduri/)
├── components/     # Componente React reutilizabile
│   ├── site/       # Componente specifice paginilor (Hero, About, Contact etc.)
│   └── ui/         # Componente din biblioteca shadcn/ui
├── lib/            # Funcții utilitare și configurări (ex. className utils)
├── pages/          # Componentele principale de rutare (Index, Gallery, ProcedureDetails)
├── App.tsx         # Componenta principală și definiția rutelor
└── main.tsx        # Punctul de intrare (entry point) în aplicație
```

## 📸 Managementul Imaginilor

Unul dintre atuurile acestui proiect este **sistemul automat de gestionare a fotografiilor pacienților**. Adăugarea pozelor noi în galerii se face simplu, prin drag & drop în foldere, fără să fie nevoie de o bază de date complexă sau de modificări în codul sursă.

Pentru instrucțiuni complete și detaliate despre cum să schimbi pozele pe site, te rugăm să consulți ghidul oficial din proiect:  
👉 **[GHID_UPLOAD_POZE.md](./GHID_UPLOAD_POZE.md)**

## 💻 Instalare & Rulare Locală

Pentru a rula și dezvolta acest proiect pe mașina locală, ai nevoie de [Node.js](https://nodejs.org/) instalat.

1. **Clonează repository-ul:**
   ```bash
   git clone <URL_REPOSITORY>
   cd varcopiere
   ```

2. **Instalează dependențele:**
   Proiectul suportă `npm` dar are fișiere de lock și pentru `bun` (`bun.lockb`). Poți folosi managerul preferat:
   ```bash
   npm install
   # sau folosind bun:
   bun install
   ```

3. **Pornește serverul de dezvoltare:**
   ```bash
   npm run dev
   # sau folosind bun:
   bun dev
   ```
   Aplicația va fi disponibilă în browser la adresa afișată în terminal (de obicei `http://localhost:5173`).

## 🛠️ Comenzi (Scripts) Disponibile

| Comandă | Descriere |
|---------|-----------|
| `npm run dev` | Pornește serverul local de dezvoltare cu Hot Module Replacement (HMR). |
| `npm run build` | Compilează și optimizează aplicația pentru producție (în folderul `dist/`). |
| `npm run preview` | Pornește un server web local care servește build-ul de producție (pentru testare finală). |
| `npm run lint` | Rulează ESLint pentru a identifica probleme de cod sau stilizare. |

## 📝 Informații Medicale & Contact

- **Medic:** Dr. Marin Voica
- **Website Live:** [drmarinvoica.ro](https://drmarinvoica.ro/)

---
*Acest fișier a fost generat pentru a facilita documentarea, mentenanța și dezvoltarea viitoare a proiectului web.*
