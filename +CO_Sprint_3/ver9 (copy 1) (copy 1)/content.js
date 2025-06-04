(function () {
  const messages = ["Take a break!", "Drink some water!", "Yoga poses?", "Go outside a bit!"];
  let currentIndex = 0;

  const width = window.innerWidth;
  const height = window.innerHeight;

  // Choose which original elements to clone and animate
  function getElementsToAnimate() {
    // Customize selectors here (nav links, images, logo, buttons...)
    return [...document.querySelectorAll('nav a, img, .logo, button')];
  }

  function runAnimation() {
    const message = messages[currentIndex];
    currentIndex = (currentIndex + 1) % messages.length;

    // Container for everything
    const container = document.createElement('div');
    Object.assign(container.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 9999,
      overflow: 'hidden',
      backgroundColor: 'white',
      opacity: '0',
      transition: 'opacity 2s ease-in',
    });
    document.body.appendChild(container);

    // Fade in background
    setTimeout(() => {
      container.style.opacity = '1';
    }, 100);

    // Get text shape points from canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = 'black';
    const fontSize = 150;
    ctx.font = `bold ${fontSize}px sans-serif`;
    const textWidth = ctx.measureText(message).width;
    const xText = (width - textWidth) / 2;
    const yText = height / 2 + fontSize / 3;
    ctx.fillText(message, xText, yText);

    const imageData = ctx.getImageData(0, 0, width, height);
    const points = [];

    for (let y = 0; y < height; y += 8) {
      for (let x = 0; x < width; x += 6) {
        const index = (y * width + x) * 4;
        if (imageData.data[index + 3] > 128) {
          points.push({ x, y });
        }
      }
    }

    // Create the small chars forming the text shape (like your original collage)
    const sampleText = document.body.innerText.replace(/\s+/g, '') || "abcdefghijklmnopqrstuvwxyz";

    // Spread small chars on the text shape points
    const maxChars = Math.min(points.length, 1000);
    const spans = [];

    for (let i = 0; i < maxChars; i++) {
      const char = sampleText[i % sampleText.length];
      const span = document.createElement('span');
      span.textContent = char;

      // Start them scattered randomly with opacity 0
      const startX = Math.random() * width;
      const startY = Math.random() * height;

      Object.assign(span.style, {
        position: 'absolute',
        left: `${startX}px`,
        top: `${startY}px`,
        fontSize: '16px',
        fontFamily: 'monospace',
        color: 'black',
        opacity: '0',
        transition: 'all 1.2s ease-in-out',
        userSelect: 'none',
        pointerEvents: 'none',
      });

      container.appendChild(span);
      spans.push(span);

      // Animate each char into text shape position
      setTimeout(() => {
        span.style.left = `${points[i].x}px`;
        span.style.top = `${points[i].y}px`;
        span.style.opacity = '1';
      }, 300 + i * 3);
    }

    // Now get clones of original DOM elements
    const originalElements = getElementsToAnimate();
    const clones = [];

    // animate max the number of points or elements, whichever smaller
    const maxClones = Math.min(originalElements.length, points.length);

    for (let i = 0; i < maxClones; i++) {
      const origEl = originalElements[i];
      const rect = origEl.getBoundingClientRect();

      // Clone element and style it fixed exactly over original
      const clone = origEl.cloneNode(true);
      Object.assign(clone.style, {
        position: 'fixed',
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        margin: 0,
        transition: 'all 2s ease-in-out',
        pointerEvents: 'none',
        zIndex: 10000,
        opacity: '1',
        transformOrigin: 'center center',
        transform: 'none',
      });

      container.appendChild(clone);
      clones.push({ clone, origRect: rect });
    }

    // Animate clones flying to random text shape points
    clones.forEach(({ clone }, i) => {
      setTimeout(() => {
        const p = points[i];
        clone.style.left = `${p.x}px`;
        clone.style.top = `${p.y}px`;
        clone.style.width = '20px';
        clone.style.height = '20px';
        clone.style.opacity = '0.7';
        clone.style.transform = `scale(0.5) rotate(${Math.random() * 360}deg)`;
      }, 800);
    });

    //Animate clones back to original places
    setTimeout(() => {
      clones.forEach(({ clone, origRect }) => {
        clone.style.left = `${origRect.left}px`;
        clone.style.top = `${origRect.top}px`;
        clone.style.width = `${origRect.width}px`;
        clone.style.height = `${origRect.height}px`;
        clone.style.opacity = '1';
        clone.style.transform = 'none';
      });

      // Scatter the small chars away and fade out
      spans.forEach((span, i) => {
        setTimeout(() => {
          span.style.left = `${Math.random() * width}px`;
          span.style.top = `${Math.random() * height}px`;
          span.style.opacity = '0';
        }, i * 2);
      });
    }, 6000);

    // Fade out container and cleanup
    setTimeout(() => {
      container.style.opacity = '0';
    }, 8000);

    setTimeout(() => {
      container.remove();
      setTimeout(runAnimation, 2000);
    }, 10000);
  }

  runAnimation();
})();
