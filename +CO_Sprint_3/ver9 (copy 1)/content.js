(function () {
  const messages = ["Take a break!", "Drink some water!", "Yoga poses?", "Go outside a bit!"];
  let currentIndex = 0;

  let sampleText = document.body.innerText.replace(/\s+/g, '');
  if (!sampleText) return;

  const width = window.innerWidth;
  const height = window.innerHeight;

  function runAnimation() {
    const message = messages[currentIndex];
    currentIndex = (currentIndex + 1) % messages.length;

    const container = document.createElement('div');
    Object.assign(container.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 9999,
      overflow: 'hidden'
    });
    document.body.appendChild(container);

    const bg = document.createElement('div');
    Object.assign(bg.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'white',
      opacity: '0',
      transition: 'opacity 2s ease-in',
      zIndex: 9998
    });
    document.body.appendChild(bg);

    setTimeout(() => {
      bg.style.opacity = '1';
    }, 100);

    function scatterFromDOMElements() {
      const elements = [];
      const sourceElems = Array.from(document.body.querySelectorAll('p, span, div, h1, h2, h3, img'));

      sourceElems.forEach(elem => {
        const rect = elem.getBoundingClientRect();
        const isImage = elem.tagName.toLowerCase() === 'img';
        const char = isImage ? '' : (elem.innerText.trim()[0] || '•');
        const item = isImage ? document.createElement('img') : document.createElement('span');

        if (isImage) {
          item.src = elem.src;
          item.style.width = '80px';
          item.style.opacity = '0.3';
        } else {
          item.textContent = char;
          item.style.fontSize = `${Math.random() * 24 + 12}px`;
          item.style.color = 'black';
        }

        Object.assign(item.style, {
          position: 'absolute',
          left: `${rect.left + rect.width / 2}px`,
          top: `${rect.top + rect.height / 2}px`,
          opacity: '0',
          transition: 'all 2s ease-out'
        });

        container.appendChild(item);
        elements.push(item);

        setTimeout(() => {
          item.style.left = `${Math.random() * width}px`;
          item.style.top = `${Math.random() * height}px`;
          item.style.opacity = '1';
        }, 1500 + Math.random() * 1000);
      });

      return elements;
    }

    const scatteredElements = scatterFromDOMElements();

    if (sampleText.length < 5000) {
      sampleText = sampleText.repeat(Math.ceil(5000 / sampleText.length));
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = 'black';
    const fontSize = 150;
    ctx.font = `bold ${fontSize}px sans-serif`;
    const textWidth = ctx.measureText(message).width;
    const x = (width - textWidth) / 2;
    const y = height / 2 + fontSize / 3;
    ctx.fillText(message, x, y);

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

    const maxChars = 1000;
    const spans = [];

    for (let i = 0; i < points.length && i < maxChars; i++) {
      const char = sampleText[i % sampleText.length];
      const span = document.createElement('span');
      span.textContent = char;

      const startX = Math.random() * width;
      const startY = Math.random() * height;

      Object.assign(span.style, {
        position: 'absolute',
        left: `${startX}px`,
        top: `${startY}px`,
        fontSize: `16px`,
        fontFamily: 'monospace',
        color: `black`,
        opacity: '0',
        transition: 'all 1.2s ease-in-out'
      });

      container.appendChild(span);
      spans.push(span);

      setTimeout(() => {
        span.style.left = `${points[i].x}px`;
        span.style.top = `${points[i].y}px`;
        span.style.opacity = '1';
      }, 1200 + i * 3);
    }

    setTimeout(() => {
      spans.forEach((span, i) => {
        setTimeout(() => {
          span.style.left = `${Math.random() * width}px`;
          span.style.top = `${Math.random() * height}px`;
          span.style.opacity = '0';
        }, i * 2);
      });

      scatteredElements.forEach((elem, i) => {
        setTimeout(() => {
          elem.style.left = `${Math.random() * width}px`;
          elem.style.top = `${Math.random() * height}px`;
          elem.style.opacity = '0';
        }, i * 3);
      });

      setTimeout(() => {
        bg.style.opacity = '0';
        container.style.opacity = '0';
      }, 2000);

      setTimeout(() => {
        document.body.removeChild(bg);
        document.body.removeChild(container);
        setTimeout(runAnimation, 8000);
      }, 3000);
    }, 7000);
  }

  runAnimation();
})();
