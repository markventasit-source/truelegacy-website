# AnimatedPopup Component

A reusable animated popup component that can be easily used across multiple components with smooth entrance animations.

## Usage

```jsx
import { useState } from "react";
import AnimatedPopup from "./AnimatedPopup";

const MyComponent = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div>
      {/* Button to trigger popup */}
      <button onClick={() => setIsPopupOpen(true)}>
        Open Popup
      </button>

      {/* Animated Popup */}
      <AnimatedPopup 
        open={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)}
        size="md"
      >
        {/* Your popup content here */}
        <h2>Popup Title</h2>
        <p>Your content goes here</p>
        <button onClick={() => setIsPopupOpen(false)}>
          Close
        </button>
      </AnimatedPopup>
    </div>
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Controls popup visibility |
| `onClose` | `function` | - | Function called when popup should close |
| `children` | `ReactNode` | - | Content to display inside popup |
| `size` | `string` | `"md"` | Popup size: `"sm"`, `"md"`, `"lg"`, `"xl"`, `"full"` |
| `showCloseButton` | `boolean` | `true` | Show/hide the close button |
| `closeOnBackdrop` | `boolean` | `true` | Close popup when clicking backdrop |

## Size Options

- `"sm"`: `max-w-sm` (384px)
- `"md"`: `max-w-md` (448px)
- `"lg"`: `max-w-lg` (512px)
- `"xl"`: `max-w-xl` (576px)
- `"full"`: `max-w-4xl` (896px)

## Features

- Smooth scale-up animation when opening
- Fade-in backdrop
- ESC key support
- Click outside to close (configurable)
- Responsive design
- Accessible close button
- Multiple size options

## Animation

The popup uses a smooth scale-up animation:
- Starts at 90% scale with slight upward position
- Animates to full scale and position
- 300ms duration with easing
- Backdrop fades in simultaneously

## Examples

### Basic Usage
```jsx
<AnimatedPopup open={isOpen} onClose={handleClose}>
  <p>Simple popup content</p>
</AnimatedPopup>
```

### With Custom Size
```jsx
<AnimatedPopup open={isOpen} onClose={handleClose} size="lg">
  <h2>Large Popup</h2>
  <p>More content here</p>
</AnimatedPopup>
```

### No Close Button
```jsx
<AnimatedPopup 
  open={isOpen} 
  onClose={handleClose} 
  showCloseButton={false}
>
  <p>Popup without close button</p>
  <button onClick={handleClose}>Custom Close</button>
</AnimatedPopup>
```

### No Backdrop Close
```jsx
<AnimatedPopup 
  open={isOpen} 
  onClose={handleClose} 
  closeOnBackdrop={false}
>
  <p>Clicking outside won't close this popup</p>
</AnimatedPopup>
```
