# TurboTune

LLM fine-tuning platform with LoRA/QLoRA training, dataset management, loss visualization, and model merging tools.

## Features

- **Training Dashboard** -- Launch and monitor LoRA/QLoRA fine-tuning runs
- **Hyperparameter Config** -- Configure rank, alpha, dropout, learning rate, and more
- **Dataset Builder** -- Create and edit instruction-tuning datasets inline
- **Loss Visualization** -- Real-time training and validation loss curves
- **Model Merging** -- Merge fine-tuned adapters with base models
- **Multi-Model Support** -- Fine-tune Llama, Mistral, and other open models
- **Run Management** -- Track queued, running, completed, and failed jobs

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **State Management:** Zustand
- **Database:** Supabase (with SSR support)
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone <repository-url>
cd turbotune
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
turbotune/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   └── lib/              # Utilities, store, mock data
├── public/               # Static assets
├── tailwind.config.ts
└── package.json
```

## License

MIT
