[![Version](https://img.shields.io/npm/v/react-word-cloud)](https://www.npmjs.com/package/react-word-cloud)
[![Downloads](https://img.shields.io/npm/dt/react-word-cloud.svg)](https://www.npmjs.com/package/react-word-cloud)

**react-word-cloud** is a lightweight and customizable React library for generating beautiful, animated word clouds. It leverages [d3-cloud](https://github.com/jasondavies/d3-cloud) for layout calculations and provides a rich set of features, including built-in support for gradients, animated word renderers, and a powerful hook for total control over rendering.

## Features

- **Fast & Lightweight:** Efficient word layout powered by d3-cloud.
- **Customizable Rendering:** Use the default word renderer or supply your own.
- **Smooth Animations:** Built-in animations for word entrance and exit via the `AnimatedWordRenderer`.
- **Gradient Support:** Apply linear or radial gradients to your word cloud with ease.
- **Custom Tooltips:** Enable a default tooltip with animated transitions, customize it, or provide your own custom tooltip renderer.
- **useWordCloud Hook:** Perform layout computations while retaining full control over the rendered SVG.
- **SVG-Based:** Render crisp, scalable visuals that are responsive by design.

## Demo
Check out the [live demo (playground)](https://react-word-cloud-demo.vercel.app/) to see `react-word-cloud` in action and explore its capabilities.

## Installation

Install via npm or yarn:

```bash
npm install react-word-cloud
# or
yarn add react-word-cloud
```

## Usage

### Basic Example

```tsx
import { Word, WordCloud } from "react-word-cloud";

const words: Word[] = [
  { text: "React", value: 500 },
  { text: "WordCloud", value: 300 },
  { text: "D3", value: 1000 },
  { text: "JavaScript", value: 400 },
  { text: "TypeScript", value: 600 },
  { text: "Word", value: 800 },
  { text: "Cloud", value: 200 },
];

function App() {
  return (
    <div
      style={{
        width: "400px",
        height: "400px",
      }}
    >
      <WordCloud words={words} width={300} height={200} />
    </div>
  );
}

export default App;
```

<figure>
  <img src="https://github.com/user-attachments/assets/83e8e3ce-3bd1-4f98-aa41-e744f2f9cb7f" alt="Basic Example Output">
  <br/>
  <figcaption>Basic Example Output</figcaption>
</figure>

### Gradient Support
Apply attractive linear or radial gradients to your word cloud.

```tsx
import { Gradient, Word, WordCloud, WordCloudProps } from "react-word-cloud";

const words: Word[] = [
  { text: "React", value: 500 },
  { text: "WordCloud", value: 300 },
  { text: "D3", value: 1000 },
  { text: "JavaScript", value: 400 },
  { text: "TypeScript", value: 600 },
  { text: "Word", value: 800 },
  { text: "Cloud", value: 200 },
];

const gradients: Gradient[] = [
  {
    id: "gradient1",
    type: "linear",
    angle: 45, // in degrees
    stops: [
      { offset: "0%", color: "#ff7e5f" },
      { offset: "100%", color: "#feb47b" },
    ],
  },
  {
    id: "gradient2",
    type: "radial",
    stops: [
      { offset: "0%", color: "#6a11cb" },
      { offset: "100%", color: "#2575fc" },
    ],
  },
];

const resolveFill: WordCloudProps["fill"] = (_word, index) => {
  return index % 2 === 0 ? "url(#gradient1)" : "url(#gradient2)";
};

function App() {
  return (
    <div
      style={{
        width: "400px",
        height: "400px",
      }}
    >
      <WordCloud words={words} width={300} height={200} gradients={gradients} fill={resolveFill} />
    </div>
  );
}

export default App;
```

<figure>
  <img src="https://github.com/user-attachments/assets/3c0092de-db38-4cd7-92a3-d7b3af7fa776" alt="Gradient Example Output">
  <br/>
  <figcaption>Gradient Example Output</figcaption>
</figure>

### Built-In AnimatedWordRenderer
For smooth animations on word entrance, use the built-in `AnimatedWordRenderer`. It animates opacity and scale transitions for each word.

```tsx
import { Word, WordCloud, WordCloudProps, AnimatedWordRenderer } from "react-word-cloud";

const words: Word[] = [
  { text: "React", value: 500 },
  { text: "WordCloud", value: 300 },
  { text: "D3", value: 1000 },
  { text: "JavaScript", value: 400 },
  { text: "TypeScript", value: 600 },
  { text: "Word", value: 800 },
  { text: "Cloud", value: 200 },
];

const animatedWordRenderer: WordCloudProps["renderWord"] = (data) => (
  <AnimatedWordRenderer data={data} animationDelay={(_word, index) => index * 50} />
);

function App() {
  return (
    <div
      style={{
        width: "400px",
        height: "400px",
      }}
    >
      <WordCloud words={words} width={300} height={200} renderWord={animatedWordRenderer} />
    </div>
  );
}

export default App;
```

### Tooltips
**react-word-cloud** includes a default tooltip implementation with animated transitions. You can enable it or completely override it with your own tooltip renderer for full customization.

#### Using the Default Tooltip
Enable the default tooltip by setting the `enableTooltip` prop to true:

```tsx
import { Word, WordCloud } from "react-word-cloud";

const words: Word[] = [
  { text: "React", value: 500 },
  { text: "WordCloud", value: 300 },
  { text: "D3", value: 1000 },
  { text: "JavaScript", value: 400 },
  { text: "TypeScript", value: 600 },
  { text: "Word", value: 800 },
  { text: "Cloud", value: 200 },
];

function App() {
  return (
    <div
      style={{
        width: "400px",
        height: "400px",
      }}
    >
      <WordCloud words={words} width={300} height={200} enableTooltip />
    </div>
  );
}

export default App;
```

<figure>
  <img src="https://github.com/user-attachments/assets/bcdf7672-a781-4d1c-9080-15a840438d20" alt="Tooltip Example Output">
  <br/>
  <figcaption>Tooltip Example Output</figcaption>
</figure>

You can customize the default tooltip styles by rendering the `DefaultTooltip` component using the `renderTooltip` prop:

```tsx
import { Word, WordCloud, WordCloudProps, DefaultTooltipRenderer } from "react-word-cloud";

const words: Word[] = [
  { text: "React", value: 500 },
  { text: "WordCloud", value: 300 },
  { text: "D3", value: 1000 },
  { text: "JavaScript", value: 400 },
  { text: "TypeScript", value: 600 },
  { text: "Word", value: 800 },
  { text: "Cloud", value: 200 },
];

const animatedWordRenderer: WordCloudProps["renderTooltip"] = (data) => (
  <DefaultTooltipRenderer
    data={data}
    containerStyle={{
      borderRadius: "10px",
      flexDirection: "column",
      minWidth: "100px",
      background: `${data.word?.fill}BF`, // 75% opacity
    }}
    textStyle={{
      fontFamily: "Arial",
      fontSize: "16px",
    }}
  />
);

function App() {
  return (
    <div
      style={{
        width: "400px",
        height: "400px",
      }}
    >
      <WordCloud
        words={words}
        width={300}
        height={200}
        enableTooltip
        renderTooltip={animatedWordRenderer}
      />
    </div>
  );
}

export default App;
```

<figure>
  <img src="https://github.com/user-attachments/assets/840768ce-5bc2-49f6-8417-ed8082da9689" alt="Customized Tooltip Example Output">
  <br/>
  <figcaption>Customized Tooltip Example Output</figcaption>
</figure>

#### Custom Tooltip Renderer
For full control over the tooltip rendering, you can provide your own custom tooltip renderer using the `renderTooltip` prop:

```tsx
import { Word, WordCloud, WordCloudProps, computeWordScreenPosition } from "react-word-cloud";

const words: Word[] = [
  { text: "React", value: 500 },
  { text: "WordCloud", value: 300 },
  { text: "D3", value: 1000 },
  { text: "JavaScript", value: 400 },
  { text: "TypeScript", value: 600 },
  { text: "Word", value: 800 },
  { text: "Cloud", value: 200 },
];

const animatedWordRenderer: WordCloudProps["renderTooltip"] = (data) => {
  const pos = computeWordScreenPosition(data);

  return (
    <div
      style={{
        position: "absolute",
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        background: "linear-gradient(135deg, rgba(50,50,50,0.95), rgba(30,30,30,0.95))",
        color: "#fff",
        padding: "10px 16px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
        transform: "translate(12px, 12px)",
        transition: "all 300ms ease-in-out",
        pointerEvents: "none",
        zIndex: 1000,
        opacity: data.word ? 1 : 0,
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "4px" }}>
        {data.word?.text}
      </div>

      {data.word && <div style={{ fontSize: "12px", opacity: 0.8 }}>Value: {data.word.value}</div>}
    </div>
  );
};

function App() {
  return (
    <div
      style={{
        width: "400px",
        height: "400px",
      }}
    >
      <WordCloud
        words={words}
        width={300}
        height={200}
        enableTooltip
        renderTooltip={animatedWordRenderer}
      />
    </div>
  );
}

export default App;
```

<figure>
  <img src="https://github.com/user-attachments/assets/0d218aec-bdbd-4c92-86a8-dee7c9926b59" alt="Custom Tooltip Example Output">
  <br/>
  <figcaption>Custom Tooltip Example Output</figcaption>
</figure>

### Event Handling
You can handle mouse and computation events on words by providing event handlers to the `WordCloud` component:

```tsx
import { Word, WordCloud, FinalWordData, ComputedWordData } from "react-word-cloud";
import { useCallback } from "react";

const words: Word[] = [
  { text: "React", value: 500 },
  { text: "WordCloud", value: 300 },
  { text: "D3", value: 1000 },
  { text: "JavaScript", value: 400 },
  { text: "TypeScript", value: 600 },
  { text: "Word", value: 800 },
  { text: "Cloud", value: 200 },
];

function App() {
  const handleWordClick = useCallback((word: FinalWordData, index: number) => {
    console.log("Clicked on word: ", word.text, index);
  }, []);

  const handleWordMouseOver = useCallback((word: FinalWordData, index: number) => {
    console.log("Mouse over word: ", word.text, index);
  }, []);

  const handleWordMouseOut = useCallback((word: FinalWordData, index: number) => {
    console.log("Mouse out word: ", word.text, index);
  }, []);

  const handleStartComputation = useCallback(() => {
    console.log("Computation started..");
  }, []);

  const handleWordComputed = useCallback((word: ComputedWordData, index: number) => {
    console.log("Computed word: ", word.text, index);
  }, []);

  const handleCompleteComputation = useCallback((words: ComputedWordData[]) => {
    console.log("Computation completed..", words);
  }, []);

  return (
    <div
      style={{
        width: "400px",
        height: "400px",
      }}
    >
      <WordCloud
        words={words}
        width={300}
        height={200}
        onWordClick={handleWordClick}
        onWordMouseOver={handleWordMouseOver}
        onWordMouseOut={handleWordMouseOut}
        onStartComputation={handleStartComputation}
        onWordComputed={handleWordComputed}
        onCompleteComputation={handleCompleteComputation}
      />
    </div>
  );
}

export default App;
```

### Configuring Other Properties
You can configure other properties of the word cloud, such as the font family, font size, and padding, by passing them as props to the `WordCloud` component:

```tsx
import { Word, WordCloud, WordCloudProps, defaultFontSize } from "react-word-cloud";

const words: Word[] = [
  { text: "React", value: 500 },
  { text: "WordCloud", value: 300 },
  { text: "D3", value: 1000 },
  { text: "JavaScript", value: 400 },
  { text: "TypeScript", value: 600 },
  { text: "Word", value: 800 },
  { text: "Cloud", value: 200 },
];

const fonts: string[] = ["Arial", "Courier New", "cursive"];
const rotationWeights: number[] = [0, 0, 90, 270];

const resolveFont: WordCloudProps["font"] = (_word, index) => {
  return fonts[index % fonts.length];
};

const resolveFontWeight: WordCloudProps["fontWeight"] = (word) => {
  const value = word.value;

  if (value < 400) {
    return "normal";
  } else if (value < 700) {
    return "bold";
  } else {
    return "bolder";
  }
};

const resolveRotate: WordCloudProps["rotate"] = () => {
  return rotationWeights[Math.floor(Math.random() * rotationWeights.length)];
};

function App() {
  return (
    <WordCloud
      words={words}
      width={300}
      height={200}
      font={resolveFont}
      fontWeight={resolveFontWeight}
      fontSize={defaultFontSize}
      rotate={resolveRotate}
      fontStyle="normal"
      spiral="rectangular"
      transition="all .3s ease"
      padding={2}
      timeInterval={1}
      containerStyle={{
        width: "400px",
        height: "400px",
      }}
    />
  );
}

export default App;
```

<figure>
  <img src="https://github.com/user-attachments/assets/3eb56461-93c2-4bb4-87c5-f7e323ebd962" alt="Customized Cloud Example Output">
  <br/>
  <figcaption>Customized Cloud Example Output</figcaption>
</figure>

### useWordCloud Hook
For ultimate flexibility, use the `useWordCloud` hook to handle layout computations asynchronously while you fully control how the words are rendered and how the SVG container is structured. The hook also accepts the `timeInterval` prop to control the maximum amount of time the browser spends on computations during each timestep and also similar props accepted by the `WordCloud` component.

```tsx
import { defaultFill, defaultFontSize, useWordCloud, Word, WordCloudProps } from "react-word-cloud";

const words: Word[] = [
  { text: "React", value: 500 },
  { text: "WordCloud", value: 300 },
  { text: "D3", value: 1000 },
  { text: "JavaScript", value: 400 },
  { text: "TypeScript", value: 600 },
  { text: "Word", value: 800 },
  { text: "Cloud", value: 200 },
];

const fonts: string[] = ["Arial", "Courier New", "cursive"];
const rotationWeights: number[] = [0, 0, 90, 270];

const resolveFont: WordCloudProps["font"] = (_word, index) => {
  return fonts[index % fonts.length];
};

const resolveFontWeight: WordCloudProps["fontWeight"] = (word) => {
  const value = word.value;

  if (value < 400) {
    return "normal";
  } else if (value < 700) {
    return "bold";
  } else {
    return "bolder";
  }
};

const resolveRotate: WordCloudProps["rotate"] = () => {
  return rotationWeights[Math.floor(Math.random() * rotationWeights.length)];
};

const WIDTH = 300;
const HEIGHT = 200;

function App() {
  const { computedWords } = useWordCloud({
    words,
    width: WIDTH,
    height: HEIGHT,
    font: resolveFont,
    fontWeight: resolveFontWeight,
    fontSize: defaultFontSize,
    rotate: resolveRotate,
    fontStyle: "normal",
    spiral: "rectangular",
    padding: 2,
    timeInterval: 1,
  });

  return (
    <div
      style={{
        width: "400px",
        height: "400px",
      }}
    >
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        <g transform={`translate(${WIDTH / 2},${HEIGHT / 2})`}>
          {computedWords.map((word, index) => (
            <text
              key={index}
              textAnchor="middle"
              transform={`translate(${word.x}, ${word.y}) rotate(${word.rotate})`}
              style={{
                fontSize: word.size,
                fontFamily: word.font,
                fontWeight: word.weight,
                fill: typeof defaultFill === "function" ? defaultFill(word, index) : defaultFill,
                transform: `translate(${word.x}, ${word.y}) rotate(${word.rotate})`,
                transition: "all 0.3s ease",
              }}
            >
              {word.text}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}

export default App;
```

## API Reference

### WordCloud

#### Props

- **words***: `Word[]` <br/>
  An array of words to be displayed in the word cloud. Each word object should have a `text` property representing the word and a `value` property representing the word's weight.
  Words with higher values are more important and will be considered before words with lower values during layout computations.
- **width***: `number` <br/>
  The width of the word cloud layout. This value is used to determine the bounds of the layout and the positioning of words.
  The in-built renderers use this as the view box width of the SVG container for responsive scaling.
- **height***: `number` <br/>
  The height of the word cloud layout. This value is used to determine the bounds of the layout and the positioning of words.
  The in-built renderers use this as the view box height of the SVG container for responsive scaling.
- **timeInterval**: `number` <br/>
  The maximum amount of time (in milliseconds) the browser spends on computations during each timestep. This value is used to control the performance of the layout computations.
  Lower values result in slower computations (depending on how busy the browser is) but provide a more responsive UI.
  Default: `1`
- **spiral**: `"archimedean" | "rectangular"` <br/>
  The type of spiral used for laying out the words. <br/>
  Default: `"archimedean"`
- **padding**: `number` <br/>
  The padding between words in the word cloud layout. <br/>
  Default: `1`
- **font**: `string | (word: Word, index: number) => string` <br/>
  The font family to be used for rendering the words. You can provide a string value for a single font family or a function that returns a font family based on the word and its index in the words array. <br/>
  Default: `"Impact"`
- **fontSize**: `number | (word: Word, index: number) => number` <br/>
  The font size to be used for rendering the words. You can provide a number value for a single font size or a function that returns a font size based on the word and its index in the words array. <br/>
  Default: `(word) => Math.sqrt(word.value)`
- **fontWeight**: `string | (word: Word) => string` <br/>
  The font weight to be used for rendering the words. You can provide a string value for a single font weight or a function that returns a font weight based on the word and its index in the words array. <br/>
  Default: `"normal"`
- **fontStyle**: `string | (word: Word) => string` <br/>
  The font style to be used for rendering the words. You can provide a string value for a single font style or a function that returns a font style based on the word and its index in the words array. <br/>
  Default: `"normal"`
- **rotate**: `(word: Word, index: number) => number` <br/>
  A function that returns the rotation angle (in degrees) for each word in the word cloud. The rotation angle is applied to the word's text. <br/>
  Default: `() => (~~(Math.random() * 6) - 3) * 30`
- **fill**: `string | (word: Word, index: number) => string` <br/>
  The fill color to be used for rendering the words. You can provide a string value for a single fill color or a function that returns a fill color based on the word and its index in the words array. <br/>
  Default: `(_, index) => scaleOrdinal(schemeCategory10)(String(index))`
- **transition**: `string | (word: Word) => string` <br/>
  The transition property to be used for rendering the words. You can provide a string value for a single transition property or a function that returns a transition property based on the word and its index in the words array. <br/>
  Default: `"all .5s ease"`
- **gradients**: `Gradient[]` <br/>
  An array of gradient objects to be used for rendering the words. Each gradient object should have an `id` property representing the gradient ID, a `type` property representing the gradient type (`linear` or `radial`), and a `stops` property representing the gradient stops.
  This only applies when the `fill` prop is set to a function that returns a gradient fill.
- **containerStyle**: `React.CSSProperties` <br/>
  The style object to be applied to the container element of the word cloud. This is useful for customizing the styles of the container.
- **enableTooltip**: `boolean` <br/>
  A boolean value indicating whether to enable the default tooltip for the words in the word cloud. When set to `true`, a tooltip will be displayed when hovering over words. <br/>
  Default: `false`
- **renderTooltip**: `(data: TooltipRendererData) => React.ReactNode` <br/>
  A function that returns the custom tooltip component to be rendered for the words in the word cloud. This function receives the tooltip data object as an argument and should return a React component representing the tooltip. <br/>
  Default: `<DefaultTooltipRenderer />`
- **renderWord**: `(data: WordRendererData) => React.ReactNode` <br/>
  A function that returns the custom word component to be rendered for the words in the word cloud. This function receives the word data object as an argument and should return a React component representing the word. <br/>
  Default: `<DefaultWordRenderer />`
- **onWordClick**: `(word: FinalWordData, index: number, event: React.MouseEvent<SVGTextElement, MouseEvent>) => void` <br/>
  A function that is called when a word in the word cloud is clicked. This function receives the final computed word data and the index of the word as arguments.<br/>
  **Note:** To use this prop with a custom word renderer, you have to invoke the provided callback function manually.
- **onWordMouseOver**: `(word: FinalWordData, index: number, event: React.MouseEvent<SVGTextElement, MouseEvent>) => void` <br/>
  A function that is called when the mouse hovers over a word in the word cloud. This function receives the final computed word data and the index of the word as arguments.<br/>
  **Note:** To use this prop with a custom word renderer, you have to invoke the provided callback function manually.
- **onWordMouseOut**: `(word: FinalWordData, index: number, event: React.MouseEvent<SVGTextElement, MouseEvent>) => void` <br/>
  A function that is called when the mouse leaves a word in the word cloud. This function receives the final computed word data and the index of the word as arguments.<br/>
  **Note:** To use this prop with a custom word renderer, you have to invoke the provided callback function manually.
- **onStartComputation**: `() => void` <br/>
  A function that is called when the layout computation starts. This function is useful for showing loading indicators or performing other tasks before the computation begins.
- **onWordComputed**: `(word: ComputedWordData, index: number) => void` <br/>
  A function that is called when a word is computed during the layout process. This function receives the computed word data and the index of the word as arguments.
  This is useful for tracking the progress of the layout computations and rendering words as they are computed instead of waiting for the entire computation to complete.
- **onCompleteComputation**: `(words: ComputedWordData[]) => void` <br/>
  A function that is called when the layout computation completes. This function receives an array of computed word data representing all the words in the word cloud.
  This is useful for performing tasks after the layout computations are finished.

### DefaultWordRenderer

#### Props

- **data***: `WordRendererData` <br/>
  The data object containing information about the word to be rendered. This object includes the word's text, value, fill color, font family, font size, font weight, rotation angle, and other properties.
- **textStyle**: `React.CSSProperties` <br/>
  The style object to be applied to the text element of the word. This is useful for customizing the styles of the word's text.

### AnimatedWordRenderer

#### Props

- **data***: `WordRendererData` <br/>
  The data object containing information about the word to be rendered. This object includes the word's text, value, fill color, font family, font size, font weight, rotation angle, and other properties.
- **animationDelay**: `number | (word: Word, index: number) => number` <br/>
  The delay (in milliseconds) before the animation starts for the word. You can provide a number value for a single delay or a function that returns a delay based on the word and its index in the words array. <br/>
  Default: `(_, index) => index * 10`
- **textStyle**: `React.CSSProperties` <br/>
  The style object to be applied to the text element of the word. This is useful for customizing the styles of the word's text.

### DefaultTooltipRenderer

#### Props

- **data***: `TooltipRendererData` <br/>
  The data object containing information about the word for which the tooltip is being rendered. This object includes the word's text, value, fill color, font family, font size, font weight, rotation angle, the underlying SVG element, layout size, and other properties.
- **transitionDuration**: `number` <br/>
  The duration (in milliseconds) of the tooltip transition animation. <br/>
  Default: `300`
- **containerStyle**: `React.CSSProperties` <br/>
  The style object to be applied to the container element of the tooltip. This is useful for customizing the styles of the tooltip container.
- **textStyle**: `React.CSSProperties` <br/>
  The style object to be applied to the text element of the tooltip. This is useful for customizing the styles of the tooltip text.
- **valueStyle**: `React.CSSProperties` <br/>
  The style object to be applied to the value element of the tooltip. This is useful for customizing the styles of the tooltip value.

### useWordCloud Hook
This hook provides a way to perform layout computations asynchronously while retaining full control over the rendered SVG. It returns an object containing the computed words and other useful data.
It computes and returns the words based on the provided parameters and the layout algorithm.

#### Parameters
The parameters of the `useWordCloud` hook are the same as the props of the `WordCloud` component excluding the `containerStyle`, `enableTooltip`, `renderTooltip`, `renderWord`, `onWordClick`, `onWordMouseOver`, and `onWordMouseOut` props.

#### Return Value
The return value of the `useWordCloud` hook is an object containing the computed words and the loading state of the layout computation:

- **computedWords**: `ComputedWordData[]` <br/>
  An array of computed word data representing the words in the word cloud. Each computed word object contains information about the word's text, value, fill color, font family, font size, font weight, rotation angle, and other properties.
- **isLoading**: `boolean` <br/>
  A boolean value indicating whether the layout computation is in progress. When set to `true`, the layout computation is still running, and **all** the computed words are not yet available.

### Utility Functions

#### computeWordScreenPosition
This utility function computes the screen position of a word in the word cloud layout. It takes the `TooltipRendererData` object as an argument and returns an object containing the x and y screen coordinates of the word.
This is handy when you need to position a custom tooltip or other elements relative to a word in the word cloud.

## Development & Testing

This library is built using Vite, yalc, and Vitest for development and testing. To get started, clone the repository and run the following commands:

```bash
# Install dependencies
npm install

# Run Tests
npm test
npm test:coverage

# Build and publish the package to yalc
npm run build:local

# Link the package to a local react application
yalc link react-word-cloud

# Unlink the package
yalc remove react-word-cloud
```

## Contributing

Contributions are welcome! Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) and [Contributing](./CONTRIBUTING.md) guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.