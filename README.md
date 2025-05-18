# Dynamic Dashboard with Harmonic Wave Visualization

This project demonstrates a responsive analytics dashboard with four different chart implementations of the same harmonic wave animation. Each implementation uses a different technology: SVG, Canvas, D3.js, and Recharts.

## Features

- Interactive dashboard with light/dark mode toggle
- Four charts visualizing harmonic waves with 40 harmonics:
  1. **SVG Chart**: Direct SVG manipulation with time and price scales
  2. **Canvas Chart**: HTML5 Canvas-based animation
  3. **D3 Chart**: Implementation using D3.js library
  4. **Recharts Chart**: Implementation using Recharts (React charting library)
- Responsive design that works on mobile and desktop
- Each chart animates a waveform created as a sum of 40 harmonic waves with random amplitude, phase shift, and frequency

## Requirements

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher) or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Nikolai-Semko/dynamic-dashboard.git
cd dynamic-dashboard
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

## Dependencies

This project uses the following libraries:
- React and React DOM
- TypeScript
- Recharts for one of the chart implementations
- D3.js for another chart implementation
- Lucide React for icons
- Tailwind CSS for styling

## Project Structure

```
src/
  ├── components/
  │   ├── SVGChart.tsx
  │   ├── CanvasChart.tsx
  │   ├── D3Chart.tsx
  │   └── RechartsChart.tsx
  ├── hooks/
  │   ├── useDarkMode.ts
  │   └── useHarmonicWave.ts
  ├── App.tsx
  ├── Dashboard.tsx
  └── index.tsx
```

## Running the Project

1. Start the development server:
```bash
npm start
# or
yarn start
```

2. Open your browser and navigate to `http://localhost:3000`

## How the Harmonic Wave Works

The harmonic wave generation is based on summing multiple sine waves with different amplitudes, periods, and phase shifts:

1. The first harmonic has the largest amplitude and period
2. Each subsequent harmonic has decreasing amplitude and period (divided by 1.4)
3. Each harmonic has a random phase shift
4. The final waveform is the sum of all harmonics
5. The animation moves by incrementing a "current" value which shifts the wave horizontally

## Implementation Details

### SVG Chart
- Uses direct SVG manipulation with React refs
- Creates separate paths for the line and area under the curve
- Updates paths dynamically in the useEffect hook
- Includes time and price scales with tick marks

### Canvas Chart
- Uses HTML5 Canvas API for rendering
- Clears and redraws the entire canvas on each animation frame
- Includes custom drawing of axes, tick marks, and gradient fill

### D3 Chart
- Uses D3.js for data visualization
- Leverages D3's scaling, axis, and line/area generators
- Creates dynamic SVG elements based on the data

### Recharts Chart
- Uses Recharts, a composable charting library for React
- Declarative components for creating the chart
- Automatic responsiveness and built-in tooltip functionality

## Customization

You can customize various aspects of the charts:

- Number of harmonics: Change the `totalHarmonics` parameter in the `useHarmonicWave` hook call (default: 40)
- Animation speed: Adjust the `speed` parameter in the `useHarmonicWave` hook call
- Colors: Update the stroke and fill colors in each chart component
- Chart dimensions: Modify the grid layout and height/width properties

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The optimized files will be in the `build` directory.

## License

MIT
